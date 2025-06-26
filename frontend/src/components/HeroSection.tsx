'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[120vh] -mt-px bg-gray-200">
      <Image
        src="/images/image0.webp"
        alt="Model wearing modern Indian wear"
        fill
        className=""
        priority
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
        <h1 className="text-5xl md:text-6xl font-headline mb-3" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          Modern Indian Wear
        </h1>
        <p className="mb-8 text-lg font-light">Where tradition meets style.</p>
        <Button size="lg" className="bg-white hover:bg-gray-100 text-black rounded-none tracking-widest font-semibold px-12 py-3 h-auto border-0">
          SHOP NOW
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
