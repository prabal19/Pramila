
'use server';

import * as z from 'zod';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const addProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  strikeoutPrice: z.coerce.number().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  bestseller: z.boolean().default(false),
  sizes: z.array(z.string()).optional(),
  specifications: z.string().optional(),
  washInstructions: z.string().optional(),
quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
});

const updateProductSchema = addProductSchema;


export async function addProduct(values: z.infer<typeof addProductSchema>) {
    try {
        const validatedValues = addProductSchema.safeParse(values);
        if (!validatedValues.success) {
            console.error(validatedValues.error.flatten().fieldErrors);
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
        revalidatePath('/admin/products');
        return { success: true, message: 'Product created successfully', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function updateProduct(id: string, values: z.infer<typeof updateProductSchema>) {
    try {
        const validatedValues = updateProductSchema.safeParse(values);
        if (!validatedValues.success) {
            console.error(validatedValues.error.flatten().fieldErrors);
            return { success: false, message: 'Invalid input for update.' };
        }

        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to update product.' };
        }
        revalidatePath('/admin/products');
        return { success: true, message: 'Product updated successfully', data };
    } catch (error) {
        console.error(error);
        if (error instanceof z.ZodError) {
             return { success: false, message: 'Invalid input for update.' };
        }
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function deleteProduct(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to delete product.' };
        }
        revalidatePath('/admin/products');
        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required.'),
    parent: z.enum(['collection', 'accessory']),
});

export async function addCategory(values: z.infer<typeof categorySchema>) {
    try {
        const validatedValues = categorySchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to create category.' };
        }

        revalidatePath('/admin/products');
        revalidatePath('/');

        return { success: true, message: 'Category created successfully', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function updateCategory(id: string, values: { name: string }) {
    try {
        const res = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to update category.' };
        }
        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true, message: 'Category updated.', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function deleteCategory(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/categories/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to delete category.' };
        }
        revalidatePath('/admin/products');
        revalidatePath('/');
        return { success: true, message: 'Category deleted.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
