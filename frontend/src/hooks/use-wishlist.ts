
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

const WISHLIST_KEY = 'pramila-wishlist';

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
    const newWishlist = [...wishlist, productId];
    if (!wishlist.includes(productId)) {
        setWishlist(newWishlist);
        updateLocalStorage(newWishlist);
        toast({ title: "Added to wishlist!" });
    }
  }, [wishlist, toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    const newWishlist = wishlist.filter(id => id !== productId);
    setWishlist(newWishlist);
    updateLocalStorage(newWishlist);
    toast({ title: "Removed from wishlist." });
  }, [wishlist, toast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist };
};
