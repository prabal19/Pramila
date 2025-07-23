
"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '@/actions/cart';
import type { CartItem as ApiCartItem, User } from '@/lib/types';

type LocalCartItem = {
    _id: string;
    productId: string;
    quantity: number;
    size: string;
}

type ShippingInfo = {
    name: string;
    phone: string;
    address: string;
}

const GUEST_CART_KEY = 'pramila-guest-cart';
const BUY_NOW_KEY = 'pramila-buy-now-item';
const SHIPPING_INFO_KEY = 'pramila-shipping-info';

// State management that works across multiple components
const listeners: Set<() => void> = new Set();
let state: {
  cartItems: (LocalCartItem[] | ApiCartItem[]);
  buyNowItem: LocalCartItem | null;
    shippingInfo: ShippingInfo | null;
  isLoading: boolean;
  hasUnseenItems: boolean;
  isUpdating: boolean;
} = {
  cartItems: [],
  buyNowItem: null,
  shippingInfo: null,
  isLoading: true,
  hasUnseenItems: false,
  isUpdating: false,
};

// Initialize state from sessionStorage on script load
if (typeof window !== 'undefined') {
    try {
        const storedShippingInfo = sessionStorage.getItem(SHIPPING_INFO_KEY);
        if (storedShippingInfo) {
            state.shippingInfo = JSON.parse(storedShippingInfo);
        }
        const buyNowData = sessionStorage.getItem(BUY_NOW_KEY);
        if (buyNowData) {
            state.buyNowItem = JSON.parse(buyNowData);
        }
    } catch (error) {
        console.error("Failed to initialize state from sessionStorage", error);
    }
}


const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setState = (newState: Partial<typeof state>) => {
  state = { ...state, ...newState };
  emitChange();
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const getSnapshot = () => state;

// Custom hook to use the external store
const useCartStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export const useCart = () => {
  const store = useCartStore();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();


  const syncGuestCart = useCallback(async (guestCart: LocalCartItem[], userId: string) => {
    if (guestCart.length === 0) return;
    setState({ isUpdating: true });
    
    let finalCart: ApiCartItem[] = [];
    // Fetch the user's current server cart first
    const serverCart = await getCart(userId);
    if(serverCart) {
        finalCart = serverCart.items;
    }

    for (const item of guestCart) {
      const updatedCart = await addItemToCart(userId, item.productId, item.quantity, item.size);
      if (updatedCart) {
        finalCart = updatedCart.items;
      }
    }
    setState({ cartItems: finalCart, isUpdating: false });
    localStorage.removeItem(GUEST_CART_KEY);
    toast({ title: "Cart Synced", description: "Your items have been moved to your account." });
  }, [toast]);

  useEffect(() => {
    const loadCart = async (currentUser: User | null) => {
        setState({ isLoading: true });
        if (currentUser) {
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            const guestCart: LocalCartItem[] = guestCartData ? JSON.parse(guestCartData) : [];
            
            if (guestCart.length > 0) {
                await syncGuestCart(guestCart, currentUser._id);
            } else {
                const serverCart = await getCart(currentUser._id);
                setState({ cartItems: serverCart?.items || [] });
            }
        } else {
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            setState({ cartItems: guestCartData ? JSON.parse(guestCartData) : [] });
        }
        //  try {
        //     const storedShippingInfo = sessionStorage.getItem(SHIPPING_INFO_KEY);
        //     if (storedShippingInfo) {
        //         setLocalShippingInfo(JSON.parse(storedShippingInfo));
        //     }
        //     const buyNowData = sessionStorage.getItem(BUY_NOW_KEY);
        //     if (buyNowData) {
        //         setState({ buyNowItem: JSON.parse(buyNowData) });
        //     }
        // } catch (error) {
        //     console.error("Failed to load data from sessionStorage", error);
        // }
        setState({ isLoading: false });
    }
    
    if (!authLoading) {
        loadCart(user);
    }
  }, [user, authLoading, syncGuestCart]);
  
  const addToCart = useCallback(async (productId: string, quantity: number, size: string, options?: { showToast?: boolean }) => {
    setState({ isUpdating: true });
    let success = false;
    if (user) {
        const updatedCart = await addItemToCart(user._id, productId, quantity, size);
        if (updatedCart) {
            setState({ cartItems: updatedCart.items });
            success = true;
        }
    } else {
        const typedPrev = state.cartItems as LocalCartItem[];
        const existingItemIndex = typedPrev.findIndex(item => item.productId === productId && item.size === size);
        let newCart: LocalCartItem[];

        if (existingItemIndex > -1) {
            newCart = [...typedPrev];
            newCart[existingItemIndex].quantity += quantity;
        } else {
            newCart = [...typedPrev, { _id: new Date().toISOString(), productId, quantity, size }];
        }
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        setState({ cartItems: newCart });
        success = true;
    }
    
    setState({ isUpdating: false });
    if (success) {
      if (options?.showToast) {
        toast({ title: "Added to cart!" });
      }
      setState({ hasUnseenItems: true });
    } else {
      toast({ variant: 'destructive', title: "Error", description: 'Failed to add item to cart.'});
    }
    return success;
  }, [user, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    setState({ isUpdating: true });
    let success = false;
    if (user) {
        const updatedCart = await removeItemFromCart(user._id, itemId);
        if (updatedCart) {
            setState({ cartItems: updatedCart.items });
            success = true;
        }
    } else {
        const newCart = (state.cartItems as LocalCartItem[]).filter(item => item._id !== itemId);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        setState({ cartItems: newCart });
        success = true;
    }

    setState({ isUpdating: false });
    if (success) {
      toast({ title: "Removed from cart." });
    } else {
      toast({ variant: 'destructive', title: "Error", description: 'Failed to remove item from cart.'});
    }
  }, [user, toast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    setState({ isUpdating: true });
    if (user) {
      const updatedCart = await updateCartItemQuantity(user._id, itemId, quantity);
       if (updatedCart) {
          setState({ cartItems: updatedCart.items });
      } else {
          toast({ variant: 'destructive', title: "Error", description: 'Failed to update quantity.'});
      }
    } else {
        const newCart = (state.cartItems as LocalCartItem[]).map(item => item._id === itemId ? { ...item, quantity } : item);
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        setState({ cartItems: newCart });
    }
    setState({ isUpdating: false });
  }, [user, removeFromCart, toast]);
  
  const markCartAsViewed = useCallback(() => {
    setState({ hasUnseenItems: false });
  }, []);
  
  const clearCart = useCallback(() => {
    if (user) {
        // We can't actually clear the DB cart here, but we can clear the local state
        // The backend will clear it upon successful order.
        setState({cartItems: []});
    } else {
      setState({cartItems: []});
      localStorage.removeItem(GUEST_CART_KEY);
    }
    sessionStorage.removeItem(SHIPPING_INFO_KEY);
     setState({ shippingInfo: null });
  }, [user]);

  const setShippingInfo = useCallback((info: ShippingInfo) => {
    try {
        sessionStorage.setItem(SHIPPING_INFO_KEY, JSON.stringify(info));
         setState({ shippingInfo: info });
    } catch(e) {
        console.error("Could not set shipping info to session storage", e)
    }
  }, []);

  const setBuyNowItem = useCallback((item: LocalCartItem) => {
    try {
        sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
        setState({ buyNowItem: item });
    } catch(e) {
        console.error("Could not set buy now item to session storage", e)
    }
  }, []);

  const clearBuyNowItem = useCallback(() => {
    sessionStorage.removeItem(BUY_NOW_KEY);
    setState({ buyNowItem: null });
  }, []);
  
  const cartCount = store.cartItems.reduce((total, item) => total + item.quantity, 0);

  return { cart: store.cartItems, cartCount, isLoading: store.isLoading, isUpdating: store.isUpdating, addToCart, removeFromCart, updateQuantity, hasUnseenItems: store.hasUnseenItems, markCartAsViewed, clearCart, shippingInfo: store.shippingInfo, setShippingInfo, buyNowItem: store.buyNowItem, setBuyNowItem, clearBuyNowItem };
};
