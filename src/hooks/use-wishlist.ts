"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const WISHLIST_KEY = 'elegance-gallery-wishlist';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_KEY);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (updatedWishlist: string[]) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  };

  const addToWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      const newWishlist = [...prev, productId];
      updateLocalStorage(newWishlist);
      toast({ title: "Added to wishlist!" });
      return newWishlist;
    });
  }, [toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId);
      updateLocalStorage(newWishlist);
      toast({ title: "Removed from wishlist." });
      return newWishlist;
    });
  }, [toast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
};
