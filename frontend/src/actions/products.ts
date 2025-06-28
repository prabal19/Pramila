'use server';

import * as z from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const productSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['sharara-set', 'saree', 'draped-sets']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  strikeoutPrice: z.coerce.number().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image URL is required'),
  bestseller: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  specifications: z.string().optional(),
});

export async function addProduct(values: z.infer<typeof productSchema>) {
    try {
        const validatedValues = productSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to create product.' };
        }

        return { success: true, message: 'Product created successfully', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
