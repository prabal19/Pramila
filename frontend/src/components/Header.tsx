
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, Heart, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import SearchOverlay from './SearchOverlay';
import { useCart } from '@/hooks/use-cart';
import CartSheet from './CartSheet';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WishlistIcon from './WishlistIcon';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/categories';
import type { Category } from '@/lib/types';


const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const StaticNavItems = [
  { href: '/', label: 'Home' },
  { href: '/new-in', label: 'New In' },
  { href: '/bestsellers', label: 'Bestsellers' },
];

const StaticBottomNavItems = [
    { href: '/about', label: 'About Us' },
];

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, hasUnseenItems, markCartAsViewed } = useCart();
  const { user } = useAuth();
  const [collections, setCollections] = useState<Category[]>([]);
  const [accessories, setAccessories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchNavCategories() {
        const allCategories = await getCategories();
        setCollections(allCategories.filter(c => c.parent === 'collection'));
        setAccessories(allCategories.filter(c => c.parent === 'accessory'));
    }
    fetchNavCategories();
  }, [])

  const handleCartClick = () => {
    if (hasUnseenItems) {
      markCartAsViewed();
    }
    setIsCartOpen(true);
  };
  
  const navItems = [
    ...StaticNavItems,
    ...(collections.length > 0 ? [{
        href: '#',
        label: 'Collections',
        dropdown: collections.map(c => ({ href: `/shop/${c.slug}`, label: c.name }))
    }] : []),
     ...(accessories.length > 0 ? [{
        href: '#', 
        label: 'Accessories',
        dropdown: accessories.map(c => ({ href: `/shop/${c.slug}`, label: c.name }))
    }] : []),
    ...StaticBottomNavItems
  ]

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                 <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-sm p-6">
                      <nav className="flex flex-col gap-2 text-lg font-medium">
                        {navItems.map((item) => (
                          !('dropdown' in item) || !item.dropdown ? (
                            <SheetClose asChild key={item.href}>
                               <Link href={item.href} className="py-3 border-b">{item.label}</Link>
                            </SheetClose>
                          ) : (
                            <Accordion type="single" collapsible key={item.label} className="w-full border-b">
                              <AccordionItem value={item.label} className="border-none">
                                <AccordionTrigger className="py-3 hover:no-underline">{item.label}</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                  {item.dropdown.map((link) => (
                                    <SheetClose asChild key={link.href}>
                                      <Link href={link.href} className="block py-2 text-base text-muted-foreground">{link.label}</Link>
                                    </SheetClose>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>
              </div>
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-bold tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  PRAMILA
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-medium">
              {navItems.map((item) => (
                <div key={item.label} className="group relative">
                    <Link href={item.href} className="text-foreground hover:text-primary transition-colors py-2 flex items-center gap-1">
                      {item.label}
                      {'dropdown' in item && item.dropdown && <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />}
                    </Link>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></div>
                  {'dropdown' in item && item.dropdown && (
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

            <div className="flex items-center justify-end gap-2 md:gap-3">
              <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                  <InstagramIcon />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href={user ? "/account" : "/login"}>
                  <User className="w-5 h-5" />
                </Link>
              </Button>
              <WishlistIcon />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-5 h-5" />
              </Button>
              <Button  id="cart-sheet-trigger" variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
                <ShoppingBag className="w-5 h-5" />
                 {cartCount > 0 && (
                    <span className={cn(
                        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-primary-foreground text-xs transition-colors",
                        hasUnseenItems ? 'bg-destructive' : 'bg-primary'
                    )}>
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
