import { getBanners } from '@/lib/banners';
import BannerDisplay from './BannerDisplay';

interface PageBannerContainerProps {
  page: string;
  position: 'top-of-page' | 'after-section' | 'bottom-of-page';
  sectionIdentifier?: string;
}

export default async function PageBannerContainer({ page, position, sectionIdentifier }: PageBannerContainerProps) {
  const allBanners = await getBanners();
  const now = new Date();

  const filteredBanners = allBanners
    .filter(banner => {
      const isPageMatch = banner.targetPages.includes(page);
      const isPositionMatch = banner.position === position;
      const isSectionMatch = position !== 'after-section' || banner.sectionIdentifier === sectionIdentifier;
      const isDateValid = 
        (!banner.startDate || new Date(banner.startDate) <= now) &&
        (!banner.endDate || new Date(banner.endDate) >= now);

      return banner.isActive && isPageMatch && isPositionMatch && isSectionMatch && isDateValid;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (filteredBanners.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-2">
      {filteredBanners.map(banner => (
        <BannerDisplay key={banner._id} banner={banner} />
      ))}
    </div>
  );
}