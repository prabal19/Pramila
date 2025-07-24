
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/use-wishlist';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/hooks/use-auth';
import { getProductsByIds } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { HeartCrack, LogIn, ShoppingCart, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }

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
  }, [wishlist, user, authLoading]);

  const handleMoveToCart = useCallback((product: Product) => {
    // For simplicity, we assume a default size or the first available size.
    // A more complex implementation would involve a size selection dialog.
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'S';
    addToCart(product.id, 1, size, { showToast: true });
    removeFromWishlist(product.id, { showToast: false });
  }, [addToCart, removeFromWishlist]);


  if (isLoading || authLoading) {
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
  
  if (!user) {
     return (
        <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex items-center justify-center">
            <div className="max-w-md mx-auto">
                <LogIn className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight">Login to View Your Wishlist</h1>
                <p className="mt-2 text-muted-foreground">Please log in to your account to add items and see your wishlist.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </div>
     )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex items-center justify-center">
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
          <ProductCard key={product.id} product={product}>
             <div className="p-2 space-y-2">
                <Button 
                    variant="outline" 
                    className="w-full text-xs h-8"
                    onClick={() => handleMoveToCart(product)}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Move to Cart
                </Button>
                 <Button 
                    variant="ghost" 
                    className="w-full text-xs h-8 text-muted-foreground"
                    onClick={() => removeFromWishlist(product.id, { showToast: true })}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
