
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
  const isOutOfStock = product.quantity === 0;
    
  return (
    <Card className={cn("group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg border-0 shadow-none rounded-none bg-transparent", isOutOfStock && "opacity-60", className)}>
      <CardHeader className="p-0 relative flex-grow">
        <Link href={`/product/${product.id}`} className={cn("block h-full", isOutOfStock && "pointer-events-none")}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={800}
            className={cn("object-cover w-full h-full aspect-[3/4] transition-transform duration-300 group-hover:scale-105", imageClassName)}
          />
        </Link>
         {isOutOfStock && (
            <Badge variant="secondary" className="absolute top-3 left-3 bg-gray-900 text-white border-0">
                OUT OF STOCK
            </Badge>
        )}
        {hasDiscount && !isOutOfStock && (
          <Badge variant="destructive" className="absolute top-3 right-3 bg-red-500 text-white border-0">
            {discountPercentage}% OFF
          </Badge>
        )}
      </CardHeader>
      <CardContent className={cn("p-4 pt-6", `text-${textAlign}`)}>
          <Link href={`/product/${product.id}`} className={cn(isOutOfStock && "pointer-events-none")}>
            <h3 className={cn("font-headline text-lg leading-tight hover:text-primary transition-colors", isOutOfStock && "line-through text-muted-foreground")}>{product.name}</h3>
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
