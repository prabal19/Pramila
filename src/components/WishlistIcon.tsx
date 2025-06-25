"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from './ui/button';

const WishlistIcon = () => {
  const { wishlist } = useWishlist();

  return (
    <Button asChild variant="ghost" size="icon">
      <Link href="/wishlist" className="relative">
        <Heart className="w-6 h-6" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {wishlist.length}
          </span>
        )}
      </Link>
    </Button>
  );
};

export default WishlistIcon;
