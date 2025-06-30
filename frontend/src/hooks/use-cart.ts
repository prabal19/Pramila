
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { getCart, addItemToCart, updateCartItemQuantity, removeItemFromCart } from '@/actions/cart';
import type { CartItem } from '@/lib/types';

export const useCart = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnseenItems, setHasUnseenItems] = useState(false);

  const fetchCart = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      const cart = await getCart(user._id);
      setCartItems(cart?.items || []);
      setIsLoading(false);
    } else {
      setCartItems([]);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [user, authLoading, fetchCart]);
  
  const addToCart = useCallback(async (productId: string, quantity: number = 1, size: string) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You must be logged in to add items to the cart.",
        });
        return;
    }
    const updatedCart = await addItemToCart(user._id, productId, quantity, size);
    if (updatedCart) {
        setCartItems(updatedCart.items);
        setHasUnseenItems(true);
        toast({ title: "Added to cart!", description: `Item added to your cart.` });
    } else {
        toast({ variant: 'destructive', title: "Error", description: 'Failed to add item to cart.'});
    }
  }, [user, toast]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!user) return;
    const updatedCart = await removeItemFromCart(user._id, itemId);
     if (updatedCart) {
        setCartItems(updatedCart.items);
        setHasUnseenItems(true);
        toast({ title: "Removed from cart." });
    } else {
        toast({ variant: 'destructive', title: "Error", description: 'Failed to remove item from cart.'});
    }
  }, [user, toast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(itemId);
    } else {
      const updatedCart = await updateCartItemQuantity(user._id, itemId, quantity);
       if (updatedCart) {
          setCartItems(updatedCart.items);
          setHasUnseenItems(true);
      } else {
          toast({ variant: 'destructive', title: "Error", description: 'Failed to update quantity.'});
      }
    }
  }, [user, removeFromCart, toast]);
  
  const markCartAsViewed = useCallback(() => {
    setHasUnseenItems(false);
  }, []);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return { cart: cartItems, cartCount, isLoading, addToCart, removeFromCart, updateQuantity, hasUnseenItems, markCartAsViewed };
};
