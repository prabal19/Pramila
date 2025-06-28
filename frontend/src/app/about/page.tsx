import AboutClientPage from '@/components/AboutClientPage';
import PageBannerContainer from '@/components/PageBannerContainer';

export default function AboutPage() {
  return (
    <>
      <PageBannerContainer page="about" position="top-of-page" />
      <AboutClientPage />
      <PageBannerContainer page="about" position="bottom-of-page" />
    </>
  );
}