import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CollectionsSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-[60vh] md:h-screen group text-white">
        <Image
          src="/images/image1.webp"
          alt="Woman in elegant modern indian wear"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-center pb-12 md:pb-20">
          <h3 className="text-3xl font-headline mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>Timeless Elegance, Modern Twist</h3>
          <Button asChild variant="link" className="text-white tracking-[0.2em] font-semibold text-xs underline-offset-4 hover:underline">
            <Link href="/shop">DISCOVER</Link>
          </Button>
        </div>
      </div>
      <div className="relative h-[60vh] md:h-screen group text-white">
        <Image
          src="/images/image2.webp"
          alt="Latest arrivals collection"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-12">
          <Link href="/" className="absolute top-8 right-8 md:top-16 md:right-16 text-4xl md:text-5xl font-bold tracking-widest text-white" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</Link>
          
          <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-headline mb-4 text-white/90" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                  Latest Arrivals
              </h2>
              <p className="mb-8 text-white text-sm">Discover Festive Favorites & Our New Collection</p>
              <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black rounded-none tracking-widest font-semibold px-12 py-3 h-auto border-0">
                  <Link href="/shop">SHOP NOW</Link>
              </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
