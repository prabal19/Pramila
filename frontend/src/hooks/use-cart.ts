
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '@/actions/cart';
import type { CartItem as ApiCartItem, User } from '@/lib/types'; // This is the type from the DB

// We'll use a slightly different type for local state to handle guest carts
type LocalCartItem = {
    _id: string; // For local identification
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
const SHIPPING_INFO_KEY = 'pramila-shipping-info';

export const useCart = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<(LocalCartItem[] | ApiCartItem[])>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnseenItems, setHasUnseenItems] = useState(false);
  const [shippingInfo, setLocalShippingInfo] = useState<ShippingInfo | null>(null);

  // Function to sync local guest cart with the backend after login
  const syncGuestCart = useCallback(async (guestCart: LocalCartItem[], userId: string) => {
    if (guestCart.length === 0) return;
    
    let finalCart: ApiCartItem[] = [];
    for (const item of guestCart) {
      const updatedCart = await addItemToCart(userId, item.productId, item.quantity, item.size);
      if (updatedCart) {
        finalCart = updatedCart.items;
      }
    }
    setCartItems(finalCart);
    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  // Main effect to handle cart loading and syncing
  useEffect(() => {
    const loadCart = async (currentUser: User | null) => {
        setIsLoading(true);
        if (currentUser) {
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            const guestCart: LocalCartItem[] = guestCartData ? JSON.parse(guestCartData) : [];
            
            const serverCart = await getCart(currentUser._id);

            if (guestCart.length > 0) {
                await syncGuestCart(guestCart, currentUser._id);
                const finalCart = await getCart(currentUser._id);
                setCartItems(finalCart?.items || []);
                 toast({ title: "Cart Synced", description: "Your items have been moved to your account." });
            } else {
                setCartItems(serverCart?.items || []);
            }
        } else {
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            setCartItems(guestCartData ? JSON.parse(guestCartData) : []);
        }
         try {
            const storedShippingInfo = sessionStorage.getItem(SHIPPING_INFO_KEY);
            if (storedShippingInfo) {
                setLocalShippingInfo(JSON.parse(storedShippingInfo));
            }
        } catch (error) {
            console.error("Failed to load shipping info from sessionStorage", error);
        }
        setIsLoading(false);
    }
    
    if (!authLoading) {
        loadCart(user);
    }
  }, [user, authLoading, syncGuestCart, toast]);
  
  const addToCart = useCallback(async (productId: string, quantity: number, size: string) => {
    let success = false;
    if (user) {
        const updatedCart = await addItemToCart(user._id, productId, quantity, size);
        if (updatedCart) {
            setCartItems(updatedCart.items);
            success = true;
        }
    } else {
        setCartItems(prev => {
            const typedPrev = prev as LocalCartItem[];
            const existingItemIndex = typedPrev.findIndex(item => item.productId === productId && item.size === size);
            let newCart: LocalCartItem[];

            if (existingItemIndex > -1) {
                newCart = [...typedPrev];
                newCart[existingItemIndex].quantity += quantity;
            } else {
                newCart = [...typedPrev, { _id: new Date().toISOString(), productId, quantity, size }];
            }
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
            return newCart;
        });
        success = true;
    }
    
    if (success) {
      setHasUnseenItems(true);
      toast({ title: "Added to cart!" });
    } else {
      toast({ variant: 'destructive', title: "Error", description: 'Failed to add item to cart.'});
    }
  }, [user, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    let success = false;
    if (user) {
        const updatedCart = await removeItemFromCart(user._id, itemId);
        if (updatedCart) {
            setCartItems(updatedCart.items);
            success = true;
        }
    } else {
        setCartItems(prev => {
            const newCart = (prev as LocalCartItem[]).filter(item => item._id !== itemId);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
            return newCart;
        });
        success = true;
    }

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
    if (user) {
      const updatedCart = await updateCartItemQuantity(user._id, itemId, quantity);
       if (updatedCart) {
          setCartItems(updatedCart.items);
      } else {
          toast({ variant: 'destructive', title: "Error", description: 'Failed to update quantity.'});
      }
    } else {
        setCartItems(prev => {
            const newCart = (prev as LocalCartItem[]).map(item => item._id === itemId ? { ...item, quantity } : item);
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
            return newCart;
        });
    }
  }, [user, removeFromCart, toast]);
  
  const markCartAsViewed = useCallback(() => {
    setHasUnseenItems(false);
  }, []);
  
  const clearCart = useCallback(() => {
    if (user) {
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
    sessionStorage.removeItem(SHIPPING_INFO_KEY);
    setLocalShippingInfo(null);
  }, [user]);

  const setShippingInfo = useCallback((info: ShippingInfo) => {
    try {
        sessionStorage.setItem(SHIPPING_INFO_KEY, JSON.stringify(info));
        setLocalShippingInfo(info);
    } catch(e) {
        console.error("Could not set shipping info to session storage", e)
    }
  }, []);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return { cart: cartItems, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, hasUnseenItems, markCartAsViewed, clearCart, shippingInfo, setShippingInfo };
};
