'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const PinterestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest"><path d="M12.017 21.5c-4.11.05-7.61-3.34-7.5-7.48.08-2.73 1.6-5.22 4.1-6.52.8-.42 1.6-.16 1.8.6l.47 1.8c.08.33.02.7-.17 1-.4.56-.62 1.2-.48 1.86.13.63.66 1.15 1.28 1.48 1.52.8 3.3-.22 3.8-1.7.53-1.54.14-3.5-1.08-4.52-1.7-1.4-4-1.6-6-1.2-2.5.5-4.5 2.6-4.5 5.2 0 .8.2 1.6.7 2.2.14.18.15.42.1.63l-.24 1.1c-.04.2-.15.28-.3.18-1.52-1.04-2.5-2.82-2.5-4.82 0-3.97 3.3-7.2 7.7-7.2 4.2 0 7.3 2.9 7.3 6.8 0 4.2-2.5 7.5-6.2 7.5-1.2 0-2.3-.6-2.7-1.3l-.43-1.65c-.15-.6-.02-1.25.38-1.7.83-1 1.2-2.3 1.2-3.5 0-1.4-.5-2.6-1.5-3.3-1.2-.8-2.8-.5-3.8.6C6.5 7.4 6 9.6 6 10.9c0 .5.1 1 .3 1.5.04.14.04.28 0 .42l-.16.7c-.03.14-.13.2-.26.13-1.2-.6-1.9-2-1.9-3.5 0-2.8 2.2-5.7 6.4-5.7 3.9 0 6.8 2.6 6.8 6 0 3.7-2.1 6.5-5.3 6.5-1.1 0-2.2-.5-2.5-1.2"/></svg>
);
const WhatsAppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2C6.52 2 2.04 6.48 2.04 12C2.04 14.16 2.68 16.14 3.82 17.82L2.84 21.22L6.34 20.26C7.94 21.32 9.88 22 12.04 22C17.56 22 22.04 17.52 22.04 12C22.04 6.48 17.56 2 12.04 2ZM17.62 16.54C17.34 16.94 16.38 17.5 15.76 17.88C15.42 18.1 15 18.16 14.64 18.06C14.28 17.96 13.54 17.76 12.16 17.22C10.54 16.58 9.24 15.44 8.28 14.18C7.52 13.16 7.06 12.22 7.06 11.34C7.06 10.46 7.38 9.8 7.64 9.5C7.9 9.2 8.2 9.08 8.44 9.08C8.7 9.08 8.92 9.08 9.1 9.1C9.34 9.14 9.68 9.88 9.8 10.12C9.92 10.36 10.28 11.24 10.34 11.38C10.4 11.5 10.34 11.66 10.22 11.78L9.74 12.32C9.68 12.4 9.6 12.48 9.68 12.6C9.74 12.72 10.12 13.3 10.92 14C11.86 14.82 12.38 15 12.6 15.08C12.74 15.14 12.88 15.12 12.98 15L13.42 14.5C13.56 14.36 13.74 14.32 13.92 14.38C14.1 14.44 14.98 14.9 15.24 15.02C15.52 15.14 15.66 15.2 15.72 15.26C15.78 15.32 15.78 15.4 15.76 15.46L15.48 15.86C15.46 15.9 15.44 15.94 15.42 15.96C16.42 15.82 17.42 16.14 17.62 16.54Z" fill="#25D366"/>
    </svg>
);


const Footer = () => {
  return (
    <footer className="bg-[#F9F9F7] text-gray-800 font-body">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
          {/* Help Column */}
          <div>
            <h3 className="font-semibold text-base mb-5 tracking-wide">Help</h3>
            <ul className="space-y-3 text-gray-600">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/#customer-reviews" className="hover:text-black transition-colors">Customer Reviews</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-black transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Get in Touch Column */}
          <div>
            <h3 className="font-semibold text-base mb-5 tracking-wide">Get in Touch</h3>
            <ul className="space-y-3 text-gray-600 list-disc list-inside">
              <li>9266748866</li>
              <li>contact@pramila.shop</li>
            </ul>
          </div>

          {/* Craftsmanship Column */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-base mb-5 tracking-wide">Immersed in Indian Craftsmanship</h3>
            <p className="text-gray-600 leading-relaxed">
              Every piece is handcrafted by skilled artisans across India who roll their eyes at mediocrity and instead weave magic.
            </p>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-semibold text-base mb-5 tracking-wide">Newsletter</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form>
              <div className="space-y-5">
                <Input
                  type="text"
                  placeholder="Name"
                  className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black placeholder:text-gray-500"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-transparent border-0 border-b border-gray-300 rounded-none px-0 py-2 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black placeholder:text-gray-500"
                />
              </div>
              <Button type="submit" className="w-full mt-8 bg-black text-white hover:bg-gray-800 rounded-none py-3 text-sm tracking-widest font-semibold h-auto">
                JOIN
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-4 text-center">
              This site is protected by hCaptcha and the hCaptcha Privacy Policy and Terms of Service apply.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-20 pt-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-x-6">
                    <div className="flex items-center gap-x-4 text-gray-500">
                        <Link href="#" className="hover:text-black transition-colors"><InstagramIcon /></Link>
                        <Link href="#" className="hover:text-black transition-colors"><FacebookIcon /></Link>
                        <Link href="#" className="hover:text-black transition-colors"><PinterestIcon /></Link>
                    </div>
                </div>
                 <div className="text-xs text-gray-500 order-first md:order-none">
                    <p>&copy; Pramila 2025</p>
                </div>
                <div>
                     <Button asChild variant="ghost" className="h-auto p-0 bg-transparent hover:bg-transparent">
                        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                         <WhatsAppIcon />
                        <span className="text-sm font-medium text-green-600">Chat With Us</span>
                        </a>
                    </Button>
                </div>
            </div>
             <div className="mt-6 flex justify-center md:justify-start">
                 <Button variant="ghost" className="flex items-center gap-1 h-auto p-2 bg-white border border-gray-200 rounded-md text-sm">
                    <Image src="https://flagcdn.com/w20/in.png" width={20} height={15} alt="Indian Flag" />
                    <span className="font-medium">INR</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
