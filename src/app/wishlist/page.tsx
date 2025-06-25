"use client";

import { useState, useEffect } from 'react';
import { useWishlist } from '@/hooks/use-wishlist';
import { getProductsByIds } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { HeartCrack } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length > 0) {
        setIsLoading(true);
        const fetchedProducts = await getProductsByIds(wishlist);
        setProducts(fetchedProducts);
        setIsLoading(false);
      } else {
        setProducts([]);
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
            <HeartCrack className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Your Wishlist is Empty</h1>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your wishlist yet. Start exploring to find something you love!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
