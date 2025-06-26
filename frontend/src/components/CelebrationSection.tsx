import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

const CelebrationSection = () => {
  return (
    <section className="bg-stone-50 py-20 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-headline mb-4" style={{fontFamily: "'Cormorant Garamond', serif"}}>
          A celebration of tradition & modern elegance
        </h2>
        <Button asChild variant="link" className="text-black tracking-[0.2em] font-semibold text-xs underline-offset-4 hover:underline">
          <Link href="/">DISCOVER</Link>
        </Button>
      </div>
    </section>
  );
};

export default CelebrationSection;
