"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  textAlign?: 'left' | 'center';
}

const ProductCard = ({ product, className, imageClassName, textAlign = 'center' }: ProductCardProps) => {
  return (
    <Card className={cn("group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg border-0 shadow-none rounded-none bg-transparent", className)}>
      <CardHeader className="p-0 relative flex-grow">
        <Link href={`/product/${product.id}`} className="block h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={800}
            className={cn("object-contain w-full h-full aspect-[3/4] transition-transform duration-300 group-hover:scale-105", imageClassName)}
          />
        </Link>
      </CardHeader>
      <CardContent className={cn("px-4 py-6", `text-${textAlign}`)}>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-headline text-lg leading-tight hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <p className="text-muted-foreground mt-1">
            Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
