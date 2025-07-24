
"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const WISHLIST_KEY = 'pramila-wishlist';

type ToastOptions = {
    showToast?: boolean;
}

// --- Global State Management ---
let state: {
    wishlist: string[];
} = {
    wishlist: [],
};

const listeners: Set<() => void> = new Set();

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

const useWishlistStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
// --- End Global State Management ---


export const useWishlist = () => {
  const store = useWishlistStore();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Effect to load wishlist from localStorage when user changes
  useEffect(() => {
    if (user) {
        try {
          const storedWishlist = localStorage.getItem(`${WISHLIST_KEY}-${user._id}`);
          if (storedWishlist) {
            setState({ wishlist: JSON.parse(storedWishlist) });
          } else {
            setState({ wishlist: [] });
          }
        } catch (error) {
          console.error("Failed to parse wishlist from localStorage", error);
        }
    } else {
        // Clear wishlist when user logs out
        setState({ wishlist: [] });
    }
  }, [user]);

  const updateLocalStorage = (updatedWishlist: string[]) => {
    if (user) {
        try {
            localStorage.setItem(`${WISHLIST_KEY}-${user._id}`, JSON.stringify(updatedWishlist));
        } catch (error) {
            console.error("Failed to save wishlist to localStorage", error);
        }
    }
  };

  const addToWishlist = useCallback((productId: string) => {
    if (!user) {
        toast({
            title: "Please Login",
            description: "You need to be logged in to add items to your wishlist.",
            variant: 'destructive',
            // action: (
            //   <Button asChild variant="secondary" size="sm">
            //     <Link href="/login">Login</Link>
            //   </Button>
            // )
        });
        return;
    }
    
    if (!state.wishlist.includes(productId)) {
        const newWishlist = [...state.wishlist, productId];
        updateLocalStorage(newWishlist);
        setState({ wishlist: newWishlist });
        toast({ title: "Added to wishlist!" });
    }
  }, [toast, user, router]);

  const removeFromWishlist = useCallback((productId: string, options?: ToastOptions) => {
    const newWishlist = state.wishlist.filter(id => id !== productId);
    updateLocalStorage(newWishlist);
    setState({ wishlist: newWishlist });
    if (options?.showToast) {
        toast({ title: "Removed from wishlist." });
    }
  }, [toast]);

  const isInWishlist = useCallback((productId: string) => {
    return store.wishlist.includes(productId);
  }, [store.wishlist]);

  return { wishlist: store.wishlist, addToWishlist, removeFromWishlist, isInWishlist };
};
