
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

type WishlistIconProps = {
    productId?: string;
    variant?: 'icon' | 'button';
}

const WishlistIcon = ({ productId, variant = 'icon' }: WishlistIconProps) => {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = useMemo(() => {
    return productId ? wishlist.includes(productId) : false;
  }, [wishlist, productId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;
    
    if (isWishlisted) {
      removeFromWishlist(productId, { showToast: true });
    } else {
      addToWishlist(productId);
    }
  };

  if (variant === 'button' && productId) {
    return (
        <Button 
            onClick={handleToggle} 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-white/80 hover:bg-white text-foreground hover:text-primary"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={cn("w-5 h-5 transition-all", isWishlisted && 'fill-red-500 text-red-500')} />
        </Button>
    )
  }

  // Default icon variant for header
  return (
    <Button asChild variant="ghost" size="icon" aria-label={`View your wishlist, ${wishlist.length} items`}>
      <Link href="/wishlist" className="relative">
        <Heart className="w-5 h-5" />
        {user && wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs" aria-hidden="true">
            {wishlist.length}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default WishlistIcon;
