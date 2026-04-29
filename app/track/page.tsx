import React from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  return (
    <div className="container section text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Track Your Order</h1>
      <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
        Order tracking is currently being upgraded. If you have recently placed an order, our team will contact you via WhatsApp with your tracking details.
      </p>
      
      <div style={{ maxWidth: '400px', width: '100%', marginBottom: '2rem' }}>
        <div className="form-group mb-4 text-left">
          <label className="form-label text-xs">ORDER NUMBER</label>
          <input type="text" className="form-input" placeholder="e.g. #LD-12345" />
        </div>
        <div className="form-group mb-6 text-left">
          <label className="form-label text-xs">EMAIL ADDRESS</label>
          <input type="email" className="form-input" placeholder="Enter your email" />
        </div>
        <button className="btn btn--primary btn--full btn--lg" onClick={() => alert('Tracking system currently down for maintenance. Please contact support via WhatsApp.')}>TRACK ORDER</button>
      </div>

      <p className="text-sm text-secondary">
        Need immediate assistance? <Link href="/contact" className="text-primary font-bold hover:underline">Contact Us</Link>
      </p>
    </div>
  );
}
