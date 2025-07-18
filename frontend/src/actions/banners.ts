
'use server';

import * as z from 'zod';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: "Please provide an image." }).optional().or(z.literal('')),
  buttonText: z.string().optional(),
  buttonLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  position: z.enum(['above-header', 'top-of-page', 'after-section', 'bottom-of-page']),
  targetPages: z.array(z.string()).min(1),
  sectionIdentifier: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  animation: z.enum(['none', 'fade', 'slide', 'zoom']).optional(),
  clickableImage: z.boolean().optional(),
});


export async function addBanner(values: z.infer<typeof bannerSchema>) {
    try {
        const validatedValues = bannerSchema.safeParse(values);
        if (!validatedValues.success) {
            console.error(validatedValues.error.flatten().fieldErrors);
            return { success: false, message: 'Invalid input. Please check the form fields.' };
        }

        const res = await fetch(`${API_URL}/api/banners`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.message || 'Failed to create banner.' };
        }
        revalidatePath('/admin/banners');
        return { success: true, message: 'Banner created successfully', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function updateBanner(id: string, values: Partial<z.infer<typeof bannerSchema>>) {
    try {
        // Since this is a partial update, we use .partial() on the schema
        const validatedValues = bannerSchema.partial().safeParse(values);
        if (!validatedValues.success) {
            console.error(validatedValues.error.flatten().fieldErrors);
            return { success: false, message: 'Invalid input. Please check the form fields.' };
        }

        const res = await fetch(`${API_URL}/api/banners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();
        
        if (!res.ok) {
            return { success: false, message: data.message || 'Failed to update banner.' };
        }
        revalidatePath('/admin/banners');
        return { success: true, message: 'Banner updated successfully', data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


export async function deleteBanner(id: string) {
    try {
        const res = await fetch(`${API_URL}/api/banners/${id}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        
        if (!res.ok) {
            const data = await res.json();
            return { success: false, message: data.message || 'Failed to delete banner.' };
        }
        revalidatePath('/admin/banners');
        return { success: true, message: 'Banner deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
