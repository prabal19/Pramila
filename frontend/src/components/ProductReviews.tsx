import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ProductReviews = () => {
  return (
    <section className="container mx-auto px-4 pt-8 pb-16">
      <Separator />
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-headline text-center mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Customer Reviews
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-8 border rounded-lg">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-300 " />
                    ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Be the first to write a review</p>
            </div>
            <Separator orientation="vertical" className="h-16 hidden md:block" />
             <Separator className="w-24 md:hidden" />
            <Button className="bg-black hover:bg-gray-800 text-white rounded-none tracking-widest font-semibold px-8 py-3 h-auto">
                WRITE A REVIEW
            </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
