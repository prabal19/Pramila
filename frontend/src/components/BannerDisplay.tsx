'use client';

import type { Banner } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const BannerDisplay = ({ banner }: { banner: Banner }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This component might be rendered on the server first,
    // so we use a timeout to ensure the animation runs on the client.
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const animationClasses: Record<string, string> = {
    fade: 'animate-fade',
    slide: 'animate-slide',
    zoom: 'animate-zoom',
  };

  const animationClass = banner.animation && banner.animation !== 'none'
    ? animationClasses[banner.animation]
    : 'opacity-100';

  const bannerContent = (
    <div className="relative z-10 p-8 md:p-12 text-center flex flex-col items-center justify-center h-full w-full">
      {banner.title && <h2 className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{banner.title}</h2>}
      {banner.subtitle && <h3 className="text-2xl mt-2">{banner.subtitle}</h3>}
      {banner.description && <p className="mt-4 max-w-xl text-lg">{banner.description}</p>}
      {banner.buttonText && banner.buttonLink && (
        <Button asChild className="mt-6 rounded-none tracking-widest font-semibold px-8 py-3 h-auto" style={{ backgroundColor: banner.textColor, color: banner.backgroundColor }} variant="default">
          <Link href={banner.buttonLink}>{banner.buttonText}</Link>
        </Button>
      )}
    </div>
  );

  const Wrapper = banner.clickableImage && banner.buttonLink ? Link : 'div';
  const wrapperProps = Wrapper === Link ? { href: banner.buttonLink || '#' } : {};

  return (
    <div className={cn('relative w-full h-[50vh] min-h-[300px] overflow-hidden my-4 opacity-0 transition-opacity duration-700', isVisible && animationClass)} style={{ backgroundColor: banner.backgroundColor || 'transparent', color: banner.textColor || '#000000' }}>
      <Wrapper {...wrapperProps} className="w-full h-full block">
        <Image
          src={banner.imageUrl}
          alt={banner.title || 'Banner image'}
          fill
          className="object-cover opacity-50"
        />
        {bannerContent}
      </Wrapper>
    </div>
  );
}

export default BannerDisplay;