'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Banner } from '@/lib/types';
import { getBanners } from '@/lib/banners';
import BannerDisplay from '@/components/BannerDisplay';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [allBanners, setAllBanners] = useState<Banner[]>([]);

  useEffect(() => {
    async function fetchBanners() {
        const banners = await getBanners();
        setAllBanners(banners);
    }
    fetchBanners();
  }, []);

  const now = new Date();

  const shouldShowBanner = (banner: Banner) => {
    const isDateValid = 
        (!banner.startDate || new Date(banner.startDate) <= now) &&
        (!banner.endDate || new Date(banner.endDate) >= now);

    if (!banner.isActive || !isDateValid) return false;

    // A bit of logic to get a comparable page identifier from the pathname
    const pageIdentifier = pathname === '/' ? 'home' : pathname.split('/').filter(Boolean)[0];

    if (banner.targetPages.includes('all')) return true;
    if (banner.targetPages.includes(pageIdentifier)) return true;
    
    // For category pages like /shop/[category]
    if(pageIdentifier === 'shop' && banner.targetPages.includes(pathname.split('/').pop() || '')) return true;

    return false;
  };

  const announcementBanners = allBanners
    .filter(b => b.position === 'above-header' && shouldShowBanner(b))
    .sort((a, b) => (a.order || 0) - (b.order || 0));


  return (
    <html lang="en" className="light">
      <head>
        <title>PRAMILA</title>
        <meta name="description" content="A simple e-commerce product browsing app." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
          {!isAdminPage && (
            <div className="w-full">
              {announcementBanners.map(banner => (
                <BannerDisplay key={banner._id} banner={banner} />
              ))}
            </div>
          )}
          {!isAdminPage && <Header />}
          <main className="flex-grow">{children}</main>
          {!isAdminPage && <Footer />}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
