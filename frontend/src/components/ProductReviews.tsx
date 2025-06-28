"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ReviewFormDialog from './ReviewFormDialog';

const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Placeholder for where you would fetch and display actual reviews
  const reviews = []; 

  const StarRatingDisplay = () => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-gray-300" />
      ))}
    </div>
  );

  return (
    <>
      <ReviewFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onFormSubmit={() => setIsFormOpen(false)}
        productId={productId}
      />
      <section className="container mx-auto px-4 pt-8 pb-16">
        <Separator />
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-headline text-center mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Customer Reviews
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 p-8 border rounded-lg">
            <div className="flex flex-col items-center md:items-start">
              <StarRatingDisplay />
               {reviews.length > 0 ? (
                 <p className="text-sm text-muted-foreground mt-2">Based on {reviews.length} reviews</p>
               ) : (
                <p className="text-sm text-muted-foreground mt-2">No reviews yet</p>
               )}
            </div>
             {user && (
                <Button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-black hover:bg-gray-800 text-white rounded-none tracking-widest font-semibold px-8 py-3 h-auto"
                >
                    WRITE A REVIEW
                </Button>
            )}
          </div>

          {/* Placeholder for review list */}
          {reviews.length === 0 && !user && (
            <p className="text-center text-muted-foreground mt-8">
              Be the first to review this product! Please log in to write a review.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductReviews;
