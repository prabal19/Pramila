'use client';

import { useState, useEffect } from 'react';
import NewsletterPopup from '@/components/NewsletterPopup';
import CollectionsSection from '@/components/CollectionsSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CelebrationSection from '@/components/CelebrationSection';
import FestiveMustHaves from '@/components/FestiveMustHaves';
import CustomerReviews from '@/components/CustomerReviews';

interface HomeClientPageProps {
  topBanners: React.ReactNode;
  bottomBanners: React.ReactNode;
  afterCelebrationBanners: React.ReactNode;
}

export default function HomeClientPage({ topBanners, bottomBanners, afterCelebrationBanners }: HomeClientPageProps) {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowPopup(true);
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);

  const handlePopupChange = (open: boolean) => {
    setShowPopup(open);
  };

  return (
    <div className="bg-white">
      {topBanners}
      <NewsletterPopup open={showPopup} onOpenChange={handlePopupChange} />
      <CelebrationSection />
      {afterCelebrationBanners}
      <CollectionsSection />
      <FeaturedProducts />
      <FestiveMustHaves />
      <CustomerReviews />
      {bottomBanners}
    </div>
  );
}