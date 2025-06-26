
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-headline mb-12 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Privacy Policy
        </h1>
        <div className="space-y-8 text-gray-700 leading-relaxed">
          
          <p>
            PRAMILA is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by PRAMILA. This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service"). By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.
          </p>

          <h2 className="text-2xl font-headline pt-4">Information We Collect</h2>
          <p>
            We collect information from you when you visit our Service, register on our site, place an order, subscribe to our newsletter, or fill out a form.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Personal Identification Information:</strong> Name, shipping address, email address, phone number.</li>
            <li><strong>Payment Information:</strong> We do not store credit card details. All payment transactions are processed through secure third-party payment gateways.</li>
            <li><strong>Browsing Information:</strong> We may collect non-personal information about your device, including your IP address, browser type, and operating system, to improve the Service.</li>
          </ul>

          <h2 className="text-2xl font-headline pt-4">How We Use Your Information</h2>
          <p>
            Any of the information we collect from you may be used in one of the following ways:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To process your transactions and deliver the products you have ordered.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
          </ul>

          <h2 className="text-2xl font-headline pt-4">How We Protect Your Information</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.
          </p>

          <h2 className="text-2xl font-headline pt-4">Do We Use Cookies?</h2>
          <p>
            Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information. We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
          </p>

          <h2 className="text-2xl font-headline pt-4">Third-Party Disclosure</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
          </p>
          
          <h2 className="text-2xl font-headline pt-4">Your Consent</h2>
          <p>
            By using our site, you consent to our website's privacy policy.
          </p>

          <h2 className="text-2xl font-headline pt-4">Changes to our Privacy Policy</h2>
          <p>
            If we decide to change our privacy policy, we will post those changes on this page.
          </p>

          <h2 className="text-2xl font-headline pt-4">Contacting Us</h2>
          <p>
            If there are any questions regarding this privacy policy, you may contact us using the information on our <Link href="/contact" className="text-primary hover:underline">Contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
