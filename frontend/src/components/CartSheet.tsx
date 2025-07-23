
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { getProductsByIds } from '@/lib/products';
import type { Product, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, X } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';  

type EnrichedCartItem = Product & { 
  quantity: number; 
  size: string;
  cartItemId: string;
};

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, cartCount, updateQuantity, removeFromCart, isLoading: isCartLoading ,clearBuyNowItem} = useCart();
  const [products, setProducts] = useState<EnrichedCartItem[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
    const router = useRouter();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (cart.length > 0) {
        setIsProductLoading(true);
        const productIds = cart.map(item => item.productId);
        const fetchedProducts = await getProductsByIds(productIds);
        
        const enrichedItems = cart.map(cartItem => {
          const product = fetchedProducts.find(p => p.id === cartItem.productId);
          return { 
            ...product!, 
            quantity: cartItem.quantity,
            size: cartItem.size,
            cartItemId: cartItem._id
          };
        }).filter(item => item.id); // Filter out any items that might not have been found

        setProducts(enrichedItems);
        setIsProductLoading(false);
      } else {
        setProducts([]);
      }
    };

    fetchCartProducts();
  }, [cart]);

    const handleCheckout = () => {
    clearBuyNowItem();
    onOpenChange(false);
    router.push('/checkout');
  }

  const subtotal = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const isLoading = isCartLoading || isProductLoading;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-white">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>CART ({cartCount})</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1 my-4">
              <div className="flex flex-col gap-6 pr-6">
                {isLoading ? (
                  [...Array(cartCount)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-24 w-24" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))
                ) : (
                  products.map(item => (
                    <div key={item.cartItemId} className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={96}
                          height={128}
                          className="object-cover"
                        />
                        <div>
                          <Link href={`/product/${item.id}`} className="font-medium hover:underline text-sm" onClick={() => onOpenChange(false)}>
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">
                             Size: {item.size}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                             Rs. {item.price.toLocaleString('en-IN')}
                          </p>
                          <div className="mt-4 flex items-center border w-fit">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} aria-label="Decrease quantity">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} aria-label="Increase quantity">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0" onClick={() => removeFromCart(item.cartItemId)} aria-label="Remove item">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="space-y-4 pr-6">
                <Separator />
                <div className="space-y-1.5 text-sm py-4">
                    <div className="flex">
                        <span className="flex-1">Subtotal</span>
                        <span className="font-semibold"> Rs. {subtotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                 <div className="space-y-3">
                    <Button onClick={handleCheckout} className="w-full rounded-none bg-black hover:bg-gray-800 text-white tracking-widest font-semibold" size="lg">
                        QUICK CHECKOUT
                    </Button>
                     <Button asChild variant="outline" className="w-full rounded-none tracking-widest font-semibold" size="lg" onClick={() => onOpenChange(false)}>
                        <Link href="/cart">VIEW CART</Link>
                    </Button>
                </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-6">
            <p className="text-muted-foreground">Your Cart is Empty</p>
            <div className="flex gap-4">
                <Button asChild variant="outline" className="rounded-none font-semibold tracking-widest border-gray-300 px-6">
                    <Link href="/shop/saree" onClick={() => onOpenChange(false)}>SAREES</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-none font-semibold tracking-widest border-gray-300 px-6">
                    <Link href="/shop/draped-sets" onClick={() => onOpenChange(false)}>DRAPED SETS</Link>
                </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
