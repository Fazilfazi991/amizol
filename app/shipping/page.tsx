import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Information | Little Dubai UAE',
  description: 'Learn about our shipping rates, delivery times, and international shipping options.',
};

export default function ShippingPage() {
  return (
    <div className="container section">
      <h1 className="text-3xl font-bold mb-8">SHIPPING INFORMATION</h1>
      
      <div className="flex flex-col gap-12">
        <section>
          <h2 className="text-xl font-bold mb-4">UAE DELIVERY</h2>
          <div className="bg-secondary p-8 rounded-lg">
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 className="text-sm font-bold mb-2">TIME</h3>
                <p className="text-secondary">24 - 48 Hours</p>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-2">COST</h3>
                <p className="text-secondary">FREE for all orders</p>
              </div>
              <div>
                <h3 className="text-sm font-bold mb-2">METHOD</h3>
                <p className="text-secondary">Express Courier</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">GCC & INTERNATIONAL</h2>
          <p className="text-secondary mb-6 leading-relaxed">
            We ship to all GCC countries and select international destinations. Shipping costs and delivery times are calculated at checkout based on your location and the weight of your order.
          </p>
          <ul className="list-disc pl-6 text-secondary flex flex-col gap-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>GCC Delivery: 3 - 5 business days</li>
            <li>International Delivery: 5 - 10 business days</li>
            <li>Tracking number provided for all international orders</li>
            <li>Customs duties and taxes may apply and are the responsibility of the customer</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">ORDER TRACKING</h2>
          <p className="text-secondary leading-relaxed">
            Once your order is shipped, you will receive an email and WhatsApp notification with your tracking number and a link to track your package in real-time. You can also track your order by contacting our customer support team.
          </p>
        </section>
      </div>
    </div>
  );
}
