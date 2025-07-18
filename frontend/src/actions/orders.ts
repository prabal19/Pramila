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
