'use server';

import * as z from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAdmin(values: z.infer<typeof loginSchema>) {
    try {
        const validatedValues = loginSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Login failed.' };
        }

        return { success: true, message: 'Login successful' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred. Please ensure the backend is running.' };
    }
}

export async function getAdminStats() {
    try {
        const res = await fetch(`${API_URL}/api/admin/stats`, { cache: 'no-store' });
        if (!res.ok) {
            return { success: false, data: null };
        }
        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        return { success: false, data: null };
    }
}
