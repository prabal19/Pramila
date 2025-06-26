import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CollectionsSection = () => {
  return (
    <section className="grid md:grid-cols-2">
      <div className="relative h-[80vh] md:h-screen group text-white">
        <Image
          src="/images/image1.webp"
          alt="Woman in elegant modern indian wear"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-center pb-20">
          <h3 className="text-3xl font-headline mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>Timeless Elegance, Modern Twist</h3>
          <Button asChild variant="link" className="text-white tracking-[0.2em] font-semibold text-xs underline-offset-4 hover:underline">
            <Link href="/">DISCOVER</Link>
          </Button>
        </div>
      </div>
      <div className="relative bg-[#F8F8F8] flex flex-col items-center justify-center text-center p-12 h-[80vh] md:h-screen">
        <Link href="/" className="absolute top-16 right-16 text-5xl font-bold tracking-widest" style={{fontFamily: "'Cormorant Garamond', serif"}}>PRAMILA</Link>
        
        <div className="text-center">
            <h2 className="text-6xl font-headline mb-4 text-black/30" style={{fontFamily: "'Cormorant Garamond', serif"}}>
                Latest Arrivals
            </h2>
            <p className="mb-8 text-muted-foreground text-sm">Discover Festive Favorites & Our New Collection</p>
            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black rounded-none tracking-widest font-semibold px-12 py-3 h-auto border border-gray-300">
                <Link href="/">SHOP NOW</Link>
            </Button>
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
