
'use client';

import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, Heart, LifeBuoy } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import SearchOverlay from './SearchOverlay';
import { useCart } from '@/hooks/use-cart';
import CartSheet from './CartSheet';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import WishlistIcon from './WishlistIcon';
import { cn } from '@/lib/utils';

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
    href: '/collections/indian-clothing',
    label: 'Collections'
  },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'About Us' },
  { href: '/support', label: 'Support' },

];

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, hasUnseenItems, markCartAsViewed } = useCart();
  const { user } = useAuth();

  const handleCartClick = () => {
    if (hasUnseenItems) {
      markCartAsViewed();
    }
    setIsCartOpen(true);
  };

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
                          !item.dropdown ? (
                            <SheetClose asChild key={item.label}>
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

            <div className="flex items-center justify-end gap-1">
              <Button asChild variant="ghost" size="icon">
                <Link href={user ? "/account" : "/login"}>
                  <User className="w-6 h-6" />
                </Link>
              </Button>
              <WishlistIcon />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={handleCartClick}>
                <ShoppingBag className="w-6 h-6" />
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
