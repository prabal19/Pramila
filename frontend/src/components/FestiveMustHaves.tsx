"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const FestiveMustHaves = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      // Filter for bestsellers or another criteria, then slice
      const mustHaves = allProducts.slice(0, 8);
      setProducts(mustHaves);
      setIsLoading(false);
    }
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
        <section className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-10">
                <h2 className="font-headline text-3xl md:text-4xl" style={{fontFamily: "'Cormorant Garamond', serif"}}>Shop Festive Must-Haves</h2>
                <Button asChild className="bg-[#4a454b] hover:bg-[#3b363c] text-white rounded-none tracking-widest font-semibold px-8 h-auto text-xs py-2.5">
                    <Link href="/shop">SHOP ALL</Link>
                </Button>
            </div>
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
    )
  }

  // Only show the section if there are any "must-have" products
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-10">
            <h2 className="font-headline text-3xl md:text-4xl" style={{fontFamily: "'Cormorant Garamond', serif"}}>Shop Festive Must-Haves</h2>
            <Button asChild className="bg-[#4a454b] hover:bg-[#3b363c] text-white rounded-none tracking-widest font-semibold px-8 h-auto text-xs py-2.5">
                <Link href="/shop">SHOP ALL</Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    </section>
  );
};

export default FestiveMustHaves;
