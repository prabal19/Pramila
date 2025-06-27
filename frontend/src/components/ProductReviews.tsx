"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { submitReview } from '@/actions/reviews';
import { reviewSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ProductReviews = ({ productId }: { productId: string }) => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId,
      name: '',
      email: '',
      rating: 0,
      title: '',
      text: '',
    },
  });

  const { watch, control, formState: { isSubmitting } } = form;
  const rating = watch('rating');

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    const result = await submitReview(values);
    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Review submitted successfully.',
      });
      setShowForm(false);
      form.reset({
        productId,
        name: '',
        email: '',
        rating: 0,
        title: '',
        text: '',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: result.message,
      });
    }
  };

  const StarRatingDisplay = () => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );

  const StarRatingInput = ({ field }: { field: any }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-8 h-8 cursor-pointer',
            star <= rating ? 'text-black fill-current' : 'text-gray-300'
          )}
          onClick={() => field.onChange(star)}
        />
      ))}
    </div>
  );

  return (
    <section className="container mx-auto px-4 pt-8 pb-16">
      <Separator />
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-headline text-center mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Customer Reviews
        </h2>
        
        {!showForm ? (
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 border rounded-lg">
            <div className="flex flex-col items-start">
              <StarRatingDisplay />
              <p className="text-sm text-muted-foreground mt-2">Be the first to write a review</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-black hover:bg-gray-800 text-white rounded-none tracking-widest font-semibold px-8 py-3 h-auto">
                WRITE A REVIEW
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-headline">Write a review</h3>
                <Button variant="link" className="text-muted-foreground hover:text-primary" onClick={() => setShowForm(false)}>Cancel review</Button>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={control} name="rating" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRatingInput field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give your review a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={control} name="text" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your comments here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormItem>
                    <FormLabel>Picture/Video (optional)</FormLabel>
                    <FormControl>
                        <label htmlFor="file-upload" className="border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-accent/50 transition-colors">
                            <Upload className="w-10 h-10 mb-2" />
                            <span>Drag & drop or click to upload</span>
                            <Input id="file-upload" type="file" className="hidden" />
                        </label>
                    </FormControl>
                </FormItem>

                <FormField control={control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (displayed publicly)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name (public)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (private)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email (private)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <p className="text-xs text-muted-foreground">
                    How we use your data: We'll only contact you about the review you left, and only if necessary. By submitting your review, you agree to our <Link href="/terms-of-service" className="underline">terms</Link>, <Link href="/privacy-policy" className="underline">privacy</Link> and content policies.
                </p>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" className="rounded-none font-semibold tracking-widest px-6" onClick={() => setShowForm(false)}>Cancel Review</Button>
                  <Button type="submit" className="rounded-none bg-black hover:bg-gray-800 text-white font-semibold tracking-widest px-6" disabled={isSubmitting}>
                    {isSubmitting ? 'SUBMITTING...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
