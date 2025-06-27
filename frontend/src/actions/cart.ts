'use server';

import type { Cart } from '@/lib/types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getCart(userId: string): Promise<Cart | null> {
    try {
        const res = await fetch(`${API_URL}/api/cart/${userId}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to get cart:', error);
        return null;
    }
}

export async function addItemToCart(userId: string, productId: string, quantity: number, size: string): Promise<Cart | null> {
    try {
        const res = await fetch(`${API_URL}/api/cart/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity, size }),
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        return null;
    }
}

export async function updateCartItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart | null> {
    try {
        const res = await fetch(`${API_URL}/api/cart/${userId}/items/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to update item quantity:', error);
        return null;
    }
}

export async function removeItemFromCart(userId: string, itemId: string): Promise<Cart | null> {
    try {
        const res = await fetch(`${API_URL}/api/cart/${userId}/items/${itemId}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        return null;
    }
}
