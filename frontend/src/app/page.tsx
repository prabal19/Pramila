
'use client';

import { useState, useEffect } from 'react';
import NewsletterPopup from '@/components/NewsletterPopup';
import HeroSection from '@/components/HeroSection';
import CollectionsSection from '@/components/CollectionsSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CelebrationSection from '@/components/CelebrationSection';
import FestiveMustHaves from '@/components/FestiveMustHaves';
import CustomerReviews from '@/components/CustomerReviews';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Set a timer to show the popup after a delay every time the page loads.
    const timer = setTimeout(() => {
        setShowPopup(true);
    }, 2000); // Show after 2 seconds

    // Clean up the timer when the component unmounts.
    return () => clearTimeout(timer);
  }, []); // The empty dependency array makes this run on every mount (e.g., page load/refresh).

  const handlePopupChange = (open: boolean) => {
    // This function now only controls the visibility of the popup for the current session.
    setShowPopup(open);
  };

  return (
    <div className="bg-white">
      <NewsletterPopup open={showPopup} onOpenChange={handlePopupChange} />
      <HeroSection />
      <CelebrationSection />
      <CollectionsSection />
      <FeaturedProducts />
      <FestiveMustHaves />
      <CustomerReviews />
    </div>
  );
}
