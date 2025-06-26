"use client";

import { useCallback } from 'react';

const VIEWED_PRODUCTS_KEY = 'elegance-gallery-viewed-products';
const MAX_VIEWED_PRODUCTS = 20;

const getViewedProducts = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(VIEWED_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to get viewed products from localStorage", error);
      return [];
    }
};

const addViewedProduct = (productId: string) => {
    if (typeof window === 'undefined') return;
    try {
        let currentViewed = getViewedProducts();
        currentViewed = currentViewed.filter(id => id !== productId);
        currentViewed.unshift(productId);
        if (currentViewed.length > MAX_VIEWED_PRODUCTS) {
            currentViewed.pop();
        }
        localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(currentViewed));
    } catch (error) {
        console.error("Failed to save viewed products to localStorage", error);
    }
};

export const useViewedProducts = () => {
  return {
    addViewedProduct: useCallback(addViewedProduct, []),
    getViewedProducts: useCallback(getViewedProducts, []),
  };
};
