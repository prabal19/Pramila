'use server';
import * as z from 'zod';
import { reviewSchema } from '@/lib/schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function submitReview(values: z.infer<typeof reviewSchema>) {
    try {
        const validatedValues = reviewSchema.safeParse(values);
        if (!validatedValues.success) {
            // Flatten errors to make them easier to display
            const errors = validatedValues.error.flatten().fieldErrors;
            const firstError = Object.values(errors)[0]?.[0] || 'Invalid input.';
            return { success: false, message: firstError };
        }

        const res = await fetch(`${API_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ msg: 'Failed to submit review.' }));
            return { success: false, message: errorData.msg || 'An unknown error occurred.' };
        }

        return { success: true, message: 'Review submitted successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
