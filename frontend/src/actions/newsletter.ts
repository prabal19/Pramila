'use server';

import * as z from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const newsletterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export async function subscribeToNewsletter(values: z.infer<typeof newsletterSchema>) {
  try {
    const validatedValues = newsletterSchema.safeParse(values);
    if (!validatedValues.success) {
        return { success: false, message: 'Invalid input.' };
    }

    const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedValues.data),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
        return { success: false, message: data.msg || 'Subscription failed.' };
    }

    return { success: true, message: 'Thank you for subscribing!' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred. Please ensure the backend is running.' };
  }
}
