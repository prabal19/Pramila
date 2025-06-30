'use server';
import type { PaymentMethod } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function savePaymentMethod(data: {
    userId: string;
    email: string;
    cardLast4: string;
    cardBrand: string;
    cardExpiry: string;
}): Promise<{ success: boolean; message: string; data?: PaymentMethod }> {
    try {
        const res = await fetch(`${API_URL}/api/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store',
        });
        const responseData = await res.json();
        if (!res.ok) {
            return { success: false, message: responseData.msg || 'Failed to save card.' };
        }
        return { success: true, message: 'Card saved.', data: responseData };
    } catch (error) {
        console.error('Failed to save payment method:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
        const res = await fetch(`${API_URL}/api/payment/${userId}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error('Failed to get payment methods:', error);
        return [];
    }
}
