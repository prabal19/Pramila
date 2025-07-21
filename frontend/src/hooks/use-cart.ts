
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '@/actions/cart';
import type { CartItem as ApiCartItem } from '@/lib/types'; // This is the type from the DB

// We'll use a slightly different type for local state to handle guest carts
type LocalCartItem = {
    _id: string; // For local identification
    productId: string;
    quantity: number;
    size: string;
}

const GUEST_CART_KEY = 'pramila-guest-cart';

export const useCart = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<LocalCartItem[] | ApiCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnseenItems, setHasUnseenItems] = useState(false);

  // Function to sync local guest cart with the backend after login
  const syncGuestCart = useCallback(async (guestCart: LocalCartItem[], userId: string) => {
    if (guestCart.length === 0) return;
    
    // Use a loop to add items one by one to handle potential duplicates on the backend
    let finalCart: ApiCartItem[] = [];
    for (const item of guestCart) {
      const updatedCart = await addItemToCart(userId, item.productId, item.quantity, item.size);
      if (updatedCart) {
        finalCart = updatedCart.items;
      }
    }
    setCartItems(finalCart);
    localStorage.removeItem(GUEST_CART_KEY);
    toast({ title: "Cart Synced", description: "Your items have been moved to your account." });
  }, [toast]);

  // Main effect to handle cart loading and syncing
  useEffect(() => {
    const loadCart = async () => {
        setIsLoading(true);
        if (user) {
            // User is logged in
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            const guestCart: LocalCartItem[] = guestCartData ? JSON.parse(guestCartData) : [];
            
            const serverCart = await getCart(user._id);

            if (guestCart.length > 0) {
                await syncGuestCart(guestCart, user._id);
                // After syncing, fetch the final state of the cart
                const finalCart = await getCart(user._id);
                setCartItems(finalCart?.items || []);
            } else {
                setCartItems(serverCart?.items || []);
            }
        } else {
            // User is a guest, load from localStorage
            const guestCartData = localStorage.getItem(GUEST_CART_KEY);
            setCartItems(guestCartData ? JSON.parse(guestCartData) : []);
        }
        setIsLoading(false);
    }
    
    if (!authLoading) {
        loadCart();
    }
  }, [user, authLoading, syncGuestCart]);
  
  const addToCart = useCallback(async (productId: string, quantity: number, size: string) => {
    if (user) {
        // Logged-in user: use API
        const updatedCart = await addItemToCart(user._id, productId, quantity, size);
        if (updatedCart) {
            setCartItems(updatedCart.items);
            setHasUnseenItems(true);
            toast({ title: "Added to cart!" });
        } else {
            toast({ variant: 'destructive', title: "Error", description: 'Failed to add item to cart.'});
        }
    } else {
        // Guest user: use localStorage
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
        setHasUnseenItems(true);
        toast({ title: "Added to cart!" });
    }
  }, [user, toast]);

  const removeFromCart = useCallback(async (itemId: string) => { // itemId can be _id from DB or local ID
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
      // Backend cart is cleared server-side upon order creation. We just sync the local state.
      setCartItems([]);
    } else {
      setCartItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [user]);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return { cart: cartItems, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, hasUnseenItems, markCartAsViewed, clearCart };
};
