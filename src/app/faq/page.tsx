
'use client';

import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const faqData = [
    {
        id: 'contact-us',
        title: 'Contact Us',
        questions: [
            {
                question: 'I want to learn more about Pramila. Who can I contact?',
                answer: 'You can reach out to us via our contact form, email us at contact@pramila.shop, or call us at +91 9266748866. We are available Monday to Friday, 9am to 7pm IST.',
            },
        ],
    },
    {
        id: 'shipping-returns',
        title: 'Shipping & Returns',
        questions: [
            {
                question: 'International Shipping',
                answer: 'Yes, we ship worldwide. Shipping costs and delivery times vary depending on the destination. All applicable customs and import duties are the responsibility of the customer.',
            },
            {
                question: 'Where do you deliver?',
                answer: 'We deliver to most countries worldwide. To confirm if we ship to your location, please proceed to checkout and enter your shipping address.',
            },
            {
                question: 'Do you accept returns or exchanges?',
                answer: 'We accept returns within 14 days of delivery for a full refund or exchange. Items must be in their original condition, unworn, with all tags attached. Made-to-order items are not eligible for returns.',
            },
            {
                question: 'Can I cancel my order?',
                answer: 'You can cancel your order within 24 hours of placing it. After this period, the order may have already been processed and cannot be canceled. Please contact us immediately if you wish to cancel.',
            },
            {
                question: 'How long does it take to deliver my order?',
                answer: 'Delivery times vary based on your location and the items ordered. Ready-to-wear items typically ship within 3-5 business days. Made-to-order items require 4-6 weeks for production before shipping.',
            },
        ],
    },
    {
        id: 'payments',
        title: 'Payments',
        questions: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), as well as PayPal, and other secure payment gateways. Cash on Delivery is available for select locations in India.',
            },
        ],
    },
    {
        id: 'order-related',
        title: 'Order Related',
        questions: [
            {
                question: "Are Pramila's outfits ready-to-wear or made to order?",
                answer: "We offer both! Our collections include ready-to-wear pieces that ship quickly, as well as exclusive made-to-order outfits that are crafted specifically for you. Please check the product description for details.",
            },
        ],
    },
];

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState(faqData[0].id);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                setActiveSection(entry.target.id);
                break;
            }
        }
      },
      {
        rootMargin: `-${(document.querySelector('header')?.clientHeight ?? 80) + 20}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentRefs.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = document.querySelector('header')?.clientHeight ?? 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
    setActiveSection(id);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <nav className="sticky top-28">
            <ul className="space-y-4">
              {faqData.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => handleNavClick(e, section.id)}
                    className={cn(
                      'block w-full font-medium text-muted-foreground hover:text-primary transition-colors',
                      activeSection === section.id && 'text-primary'
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">
          <div className="space-y-12">
            {faqData.map((section, index) => (
              <section 
                key={section.id} 
                id={section.id}
                ref={el => sectionRefs.current[index] = el}
                className="scroll-mt-28"
              >
                <h2 className="text-2xl font-headline pb-2 mb-4 border-b">{section.title}</h2>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                  {section.questions.map((item, qIndex) => (
                    <AccordionItem value={`item-${qIndex}`} key={qIndex}>
                      <AccordionTrigger className="text-left hover:no-underline text-base font-normal text-gray-800 py-6">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
