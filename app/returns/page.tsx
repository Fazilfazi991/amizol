import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Little Dubai UAE',
  description: 'Learn about our 30-day hassle-free return and exchange policy.',
};

export default function ReturnsPage() {
  return (
    <div className="container section">
      <h1 className="text-3xl font-bold mb-8">RETURNS & EXCHANGES</h1>
      
      <div className="flex flex-col gap-12 max-w-4xl" style={{ maxWidth: '900px' }}>
        <section>
          <h2 className="text-xl font-bold mb-4">OUR POLICY</h2>
          <p className="text-secondary leading-relaxed mb-4">
            We want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, we offer a <strong>30-day hassle-free return and exchange policy</strong>.
          </p>
          <p className="text-secondary leading-relaxed">
            Items must be returned in their original condition: unworn, unwashed, and with all original tags and packaging intact. For footwear, please include the original box in its original condition as well.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">HOW TO RETURN</h2>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="p-6 bg-secondary rounded">
              <h3 className="font-bold mb-2">1. CONTACT US</h3>
              <p className="text-sm text-secondary">WhatsApp or email us with your order number and the items you wish to return.</p>
            </div>
            <div className="p-6 bg-secondary rounded">
              <h3 className="font-bold mb-2">2. WE PICK UP</h3>
              <p className="text-sm text-secondary">We will arrange for a courier to pick up the return from your location within 24-48 hours.</p>
            </div>
            <div className="p-6 bg-secondary rounded">
              <h3 className="font-bold mb-2">3. REFUND</h3>
              <p className="text-sm text-secondary">Once inspected, we will issue a refund or process your exchange immediately.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">REFUNDS</h2>
          <p className="text-secondary leading-relaxed mb-4">
            Refunds for orders paid by Credit/Debit card will be processed back to the same card. For Cash on Delivery orders, we offer refunds via store credit or bank transfer.
          </p>
          <p className="text-secondary leading-relaxed">
            Please allow 3-5 business days for the refund to reflect in your account once the return has been approved.
          </p>
        </section>
      </div>
    </div>
  );
}
