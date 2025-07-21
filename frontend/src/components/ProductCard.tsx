
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  className?: string;
  imageClassName?: string;
  textAlign?: 'left' | 'center';
}

const ProductCard = ({ product, className, imageClassName, textAlign = 'center' }: ProductCardProps) => {
  const hasDiscount = product.strikeoutPrice && product.strikeoutPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.strikeoutPrice! - product.price) / product.strikeoutPrice!) * 100)
    : 0;
    
  return (
    <Card className={cn("group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg border-0 shadow-none rounded-none bg-transparent", className)}>
      <CardHeader className="p-0 relative flex-grow">
        <Link href={`/product/${product.id}`} className="block h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={800}
            className={cn("object-cover w-full h-full aspect-[3/4] transition-transform duration-300 group-hover:scale-105", imageClassName)}
          />
        </Link>
        {hasDiscount && (
          <Badge variant="destructive" className="absolute top-3 right-3 bg-red-500 text-white border-0">
            {discountPercentage}% OFF
          </Badge>
        )}
      </CardHeader>
      <CardContent className={cn("p-4", `text-${textAlign}`)}>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-headline text-lg leading-tight hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <div className={`mt-1 flex gap-2 items-baseline ${textAlign === 'center' ? 'justify-center' : 'justify-start'}`}>
            <p className="text-foreground font-semibold">
                Rs. {product.price.toLocaleString('en-IN')}
            </p>
            {hasDiscount && (
                 <p className="text-muted-foreground text-sm line-through">
                    Rs. {product.strikeoutPrice!.toLocaleString('en-IN')}
                </p>
            )}
          </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
