"use client";

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';


const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      setProducts(allProducts.slice(0, 5));
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
        <section className="container mx-auto px-4 py-16">
            <h2 className="text-center font-headline text-4xl mb-10" style={{fontFamily: "'Cormorant Garamond', serif"}}>Shop The Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex flex-col space-y-3 h-full">
                        <Skeleton className="h-[60vh] md:h-full w-full rounded-lg" />
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[40vh] md:h-full w-full rounded-lg" />
                            <div className="space-y-2 pt-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
  }

  if (products.length < 5) {
    return null;
  }

  const [largeProduct, ...smallProducts] = products;

  return (
    <section className="container mx-auto px-4 py-16">
        <h2 className="text-center font-headline text-4xl mb-10" style={{fontFamily: "'Cormorant Garamond', serif"}}>Shop The Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <ProductCard product={largeProduct} imageClassName="!aspect-auto" textAlign="left" />
            <div className="grid grid-cols-2 gap-8">
                {smallProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    </section>
  );
};

export default FeaturedProducts;
