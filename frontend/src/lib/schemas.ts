import * as z from 'zod';

export const reviewSchema = z.object({
    productId: z.string(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('A valid email is required'),
    rating: z.number().min(1, 'Rating is required').max(5),
    title: z.string().min(1, 'Review title is required'),
    text: z.string().min(1, 'Review text is required'),
    imageUrl: z.string().optional(),
});
