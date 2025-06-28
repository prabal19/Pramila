import HomeClientPage from '@/components/HomeClientPage';
import PageBannerContainer from '@/components/PageBannerContainer';

export default function Home() {
  const afterCelebrationBanners = (
    <PageBannerContainer
      page="home"
      position="after-section"
      sectionIdentifier="celebration-section"
    />
  );

  return (
    <HomeClientPage
      topBanners={<PageBannerContainer page="home" position="top-of-page" />}
      bottomBanners={<PageBannerContainer page="home" position="bottom-of-page" />}
      afterCelebrationBanners={afterCelebrationBanners}
    />
  );
}