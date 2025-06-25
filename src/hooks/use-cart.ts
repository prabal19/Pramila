"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from '@/lib/types';

const CART_KEY = 'pramila-cart';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (updatedCart: CartItem[]) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  };

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === productId);
      let newCart;
      if (existingItem) {
        newCart = prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newCart = [...prev, { id: productId, quantity }];
      }
      updateLocalStorage(newCart);
      toast({ title: "Added to cart!", description: `${quantity} item(s) added.` });
      return newCart;
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== productId);
      updateLocalStorage(newCart);
      toast({ title: "Removed from cart." });
      return newCart;
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prev => {
      let newCart;
      if (quantity <= 0) {
        newCart = prev.filter(item => item.id !== productId);
      } else {
        newCart = prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
      }
      updateLocalStorage(newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
      setCart([]);
      updateLocalStorage([]);
  }, []);
  
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return { cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart };
};
