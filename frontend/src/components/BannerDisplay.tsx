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
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isHero = banner.position === 'top-of-page' && banner.targetPages.includes('home') && banner.order === -1;
  const isAnnouncement = banner.position === 'above-header';

  const animationClasses: Record<string, string> = {
    fade: 'animate-fade',
    slide: 'animate-slide',
    zoom: 'animate-zoom',
  };

  const animationClass = banner.animation && banner.animation !== 'none'
    ? animationClasses[banner.animation]
    : 'opacity-100';
    
  const Wrapper = banner.clickableImage && banner.buttonLink ? Link : 'div';
  const wrapperProps = Wrapper === Link ? { href: banner.buttonLink || '#' } : {};

  const bannerContent = (
      isAnnouncement ? (
        <div className="relative z-10 w-full text-center" style={{ color: banner.textColor }}>
            {banner.description || banner.title}
        </div>
      ) : (
        <div className="relative z-10 p-4 text-center flex flex-col items-center justify-center h-full w-full">
          {banner.title && <h1 className={cn(isHero ? "text-5xl md:text-6xl text-white" : "text-4xl font-bold", "font-headline mb-3")} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{banner.title}</h1>}
          
          {isHero && banner.description && <p className="mb-8 text-lg font-light text-white">{banner.description}</p>}
          
          {!isHero && banner.subtitle && <h3 className="text-2xl mt-2">{banner.subtitle}</h3>}
          {!isHero && banner.description && <p className="mt-4 max-w-xl text-lg">{banner.description}</p>}
          
          {banner.buttonText && banner.buttonLink && (
            isHero ? (
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black rounded-none tracking-widest font-semibold px-12 py-3 h-auto border-0">
                <Link href={banner.buttonLink}>{banner.buttonText}</Link>
              </Button>
            ) : (
              <Button asChild className="mt-6 rounded-none tracking-widest font-semibold px-8 py-3 h-auto" style={{ backgroundColor: banner.textColor, color: banner.backgroundColor }} variant="default">
                <Link href={banner.buttonLink}>{banner.buttonText}</Link>
              </Button>
            )
          )}
        </div>
      )
  );

  return (
    <Wrapper {...wrapperProps} className={cn(
        'relative w-full overflow-hidden opacity-0 transition-opacity duration-700',
        isHero ? 'h-[60vh] md:h-[90vh]'
        : isAnnouncement ? 'h-auto py-2.5 font-light text-xs tracking-wider flex items-center justify-center'
        : 'h-[50vh] min-h-[300px] my-4 container mx-auto px-4',
        isVisible && animationClass,
        Wrapper === Link ? 'block hover:opacity-90 transition-opacity' : ''
    )} style={{ backgroundColor: banner.backgroundColor || 'transparent', color: banner.textColor || '#000000' }}>
       {banner.imageUrl && !isAnnouncement && (
          <>
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Banner image'}
              fill
              className="object-cover object-top opacity-70"
              priority={isHero}
            />
            <div className="absolute inset-0 bg-black/30" />
          </>
        )}
      {bannerContent}
    </Wrapper>
  );
}

export default BannerDisplay;
