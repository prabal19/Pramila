"use client";

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';

const RelatedProducts = ({ currentProductId }: { currentProductId: string }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const allProducts = await getProducts();
        const filtered = allProducts
          .filter(p => p.id !== currentProductId) // Exclude the current product
          .sort(() => 0.5 - Math.random()) // Shuffle the array
          .slice(0, 4); // Take the first 4
        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [currentProductId]);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-headline text-center mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          You may also like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full" />
              <div className="space-y-2 pt-2 text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-headline text-center mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        You may also like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
