import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Little Dubai UAE',
  description: 'Get in touch with Little Dubai for any inquiries, orders, or support. We are here to help you.',
};

export default function ContactPage() {
  return (
    <div className="container section">
      <h1 className="text-3xl font-bold mb-8">CONTACT US</h1>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div>
          <h2 className="text-xl font-bold mb-4">GET IN TOUCH</h2>
          <p className="text-secondary mb-6">
            Have a question about a product, your order, or just want to say hi? We're here to help!
          </p>
          
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-bold text-uppercase mb-2">WHATSAPP</h3>
              <p className="text-secondary">+971 50 123 4567 (Demo)</p>
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-bold">CHAT NOW</a>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-uppercase mb-2">EMAIL</h3>
              <p className="text-secondary">support@amizol.com</p>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-uppercase mb-2">WORKING HOURS</h3>
              <p className="text-secondary">Monday - Sunday: 9:00 AM - 10:00 PM (GST)</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">SEND US A MESSAGE</h2>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">NAME</label>
              <input type="text" className="form-input" placeholder="Your Name" style={{ border: '1px solid var(--color-border)', padding: '1rem' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">EMAIL</label>
              <input type="email" className="form-input" placeholder="Your Email" style={{ border: '1px solid var(--color-border)', padding: '1rem' }} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold">MESSAGE</label>
              <textarea className="form-input" placeholder="How can we help?" style={{ border: '1px solid var(--color-border)', padding: '1rem', minHeight: '150px' }}></textarea>
            </div>
            <button type="submit" className="btn btn--primary btn--lg">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </div>
  );
}
