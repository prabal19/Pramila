
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import SearchOverlay from './SearchOverlay';
import { useCart } from '@/hooks/use-cart';
import CartSheet from './CartSheet';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  const navItems = [
    { href: '/', label: 'Home' },
    {
      href: '/shop',
      label: 'Shop',
      dropdown: [
        { href: '/shop', label: 'All products' },
        { href: '/shop/sharara-set', label: 'Sharara set' },
        { href: '/shop/saree', label: 'Saree' },
        { href: '/shop/draped-sets', label: 'Draped Sets' },
      ],
    },
    {
      href: '/collections',
      label: 'Collections',
      dropdown: [{ href: '/collections/indian-clothing', label: 'Indian clothing' }],
    },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <>
      <div className="bg-[#4a454b] text-white/90 text-center text-xs py-2.5 font-light tracking-wider">
        <span>Shipping worldwide</span>
        <span className="mx-2">|</span>
        <span>Handcrafted Luxury</span>
      </div>
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="w-48">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  PRAMILA
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
              {navItems.map((item) => (
                <div key={item.label} className="group relative">
                  <Link href={item.href} className="text-foreground hover:text-primary transition-colors py-2">
                    {item.label}
                  </Link>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></div>
                  {item.dropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 hidden group-hover:block z-50">
                      <div className="bg-popover text-popover-foreground shadow-lg w-auto py-2 rounded-none">
                        {item.dropdown.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block whitespace-nowrap px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center justify-end gap-2 w-48">
              <Button asChild variant="ghost" size="icon">
                <Link href="/login">
                  <User className="w-6 h-6" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="w-6 h-6" />
                 {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                        {cartCount}
                    </span>
                 )}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <SearchOverlay open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Header;
