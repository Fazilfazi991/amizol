import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Little Dubai UAE',
  description: 'Find answers to common questions about Little Dubai, shipping, returns, and more.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Are your products authentic?",
      a: "Yes, 100%. We source every product directly from authorized brand distributors and premium boutiques. Each item undergoes a rigorous authentication process before being shipped to you."
    },
    {
      q: "How long does delivery take?",
      a: "For orders within the UAE, we offer express delivery within 24–48 hours. International shipping times vary by location but typically take 3–7 business days."
    },
    {
      q: "Can I pay with Cash on Delivery?",
      a: "Yes, we offer Cash on Delivery for all orders within the UAE. You only pay when you receive your package."
    },
    {
      q: "What is your return policy?",
      a: "We offer a 30-day hassle-free return and exchange policy. Items must be in their original condition, unworn, and with all tags and packaging intact."
    },
    {
      q: "Do you have a physical store?",
      a: "Currently, Little Dubai operates exclusively online to provide the widest possible selection at the best prices. However, our dedicated personal shopping team is available via WhatsApp to help you with sizing and style advice."
    }
  ];

  return (
    <div className="container section">
      <h1 className="text-3xl font-bold mb-12 text-center">FREQUENTLY ASKED QUESTIONS</h1>
      <div className="max-w-3xl mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="flex flex-col gap-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pb-8 border-b border-border">
              <h3 className="text-lg font-bold mb-3">{faq.q}</h3>
              <p className="text-secondary leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
