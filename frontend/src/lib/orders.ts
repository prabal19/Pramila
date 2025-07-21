
'use server';

import type { Order, OrderStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createOrder(orderData: {
    userId: string;
    items: { productId: string; name: string; quantity: number; price: number; size: string; }[];
    totalAmount: number;
    shippingAddress: string;
}): Promise<{ success: boolean; message: string; data?: Order }> {
     try {
        const res = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
            cache: 'no-store',
        });
        const responseData = await res.json();
        if (!res.ok) {
            return { success: false, message: responseData.msg || 'Failed to create order.' };
        }
        return { success: true, message: 'Order created successfully.', data: responseData };
    } catch (error) {
        console.error('Failed to create order:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ success: boolean; message: string; data?: Order }> {
    try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to update order status.' };
        }
        
        revalidatePath('/admin/orders');
        revalidatePath('/admin/payments');
        return { success: true, message: 'Order status updated successfully.', data };
    } catch (error) {
        console.error('Failed to update order status:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function getAdminOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}/api/orders`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Failed to fetch orders, status:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('getOrders error:', error);
    return [];
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
    if (!userId) return [];
    try {
        const res = await fetch(`${API_URL}/api/orders/user/${userId}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch user orders, status:', res.status);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error('getUserOrders error:', error);
        return [];
    }
}


export async function getOrderById(orderId: string): Promise<Order | null> {
    try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return null;
    }
}
