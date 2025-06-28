import ContactClientPage from '@/components/ContactClientPage';
import PageBannerContainer from '@/components/PageBannerContainer';

export default function ContactPage() {
  return (
    <>
      <PageBannerContainer page="contact" position="top-of-page" />
      <ContactClientPage />
      <PageBannerContainer page="contact" position="bottom-of-page" />
    </>
  );
}