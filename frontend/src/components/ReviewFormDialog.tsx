'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { submitReview } from '@/actions/reviews';
import { reviewSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface ReviewFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFormSubmit: () => void;
    productId?: string;
}

const ReviewFormDialog = ({ open, onOpenChange, onFormSubmit, productId }: ReviewFormDialogProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            productId: productId || '',
            name: '',
            email: '',
            rating: 0,
            title: '',
            text: '',
        },
    });

    useEffect(() => {
        if (open && !productId) {
            getProducts().then(setProducts);
        }
        if (open && user) {
            form.reset({
                productId: productId || '',
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                rating: 0,
                title: '',
                text: '',
            });
        }
    }, [open, productId, user, form]);

    const { watch, control, formState: { isSubmitting } } = form;
    const rating = watch('rating');

    const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
        const result = await submitReview(values);
        if (result.success) {
            toast({ title: 'Success!', description: 'Review submitted successfully.' });
            onFormSubmit();
        } else {
            toast({ variant: 'destructive', title: 'Submission Failed', description: result.message });
        }
    };

    const StarRatingInput = ({ field }: { field: any }) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn('w-8 h-8 cursor-pointer', star <= rating ? 'text-black fill-current' : 'text-gray-300')}
                    onClick={() => field.onChange(star)}
                />
            ))}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Write a review</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {!productId && (
                            <FormField
                                control={control}
                                name="productId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product*</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a product to review" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <FormField control={control} name="rating" render={({ field }) => (
                            <FormItem><FormLabel>Rating*</FormLabel><FormControl><StarRatingInput field={field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="title" render={({ field }) => (
                            <FormItem><FormLabel>Review Title*</FormLabel><FormControl><Input placeholder="Give your review a title" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="text" render={({ field }) => (
                            <FormItem><FormLabel>Review*</FormLabel><FormControl><Textarea placeholder="Write your comments here" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Name (displayed publicly)*</FormLabel><FormControl><Input placeholder="Enter your name (public)" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email (private)*</FormLabel><FormControl><Input placeholder="Enter your email (private)" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <p className="text-xs text-muted-foreground">
                            By submitting your review, you agree to our <Link href="/terms-of-service" className="underline">terms</Link> and <Link href="/privacy-policy" className="underline">policies</Link>.
                        </p>
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Review'}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewFormDialog;
