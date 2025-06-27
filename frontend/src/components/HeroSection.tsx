'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative w-full -mt-px bg-gray-200" style={{'--aspect-ratio': '1.547'} as React.CSSProperties}>
      <div className="relative w-full h-[60vh] md:h-[90vh]">
         <Image
          src="/images/image0.webp"
          alt="Model wearing modern Indian wear"
          fill
          className="object-cover object-top"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-white text-center">
        <h1 className="text-5xl md:text-6xl font-headline mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          Modern Indian Wear
        </h1>
        <p className="mb-8 text-lg font-light">Where tradition meets style.</p>
        <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-black rounded-none tracking-widest font-semibold px-12 py-3 h-auto border-0">
          <Link href="/shop">SHOP NOW</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
