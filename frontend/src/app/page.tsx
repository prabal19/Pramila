'use client';

import { useState, useEffect } from 'react';
import NewsletterPopup from '@/components/NewsletterPopup';
import HeroSection from '@/components/HeroSection';
import CollectionsSection from '@/components/CollectionsSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CelebrationSection from '@/components/CelebrationSection';
import FestiveMustHaves from '@/components/FestiveMustHaves';
import CustomerReviews from '@/components/CustomerReviews';

const NEWSLETTER_POPUP_SEEN_KEY = 'pramila-newsletter-popup-seen';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(NEWSLETTER_POPUP_SEEN_KEY);
    if (!hasSeenPopup) {
        const timer = setTimeout(() => {
            setShowPopup(true);
            localStorage.setItem(NEWSLETTER_POPUP_SEEN_KEY, 'true');
        }, 2000); // Show after 2 second delay
        return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-white">
      <NewsletterPopup open={showPopup} onOpenChange={setShowPopup} />
      <HeroSection />
      <CelebrationSection />
      <CollectionsSection />
      <FeaturedProducts />
      <FestiveMustHaves />
      <CustomerReviews />
    </div>
  );
}
