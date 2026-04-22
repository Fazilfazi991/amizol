'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer bg-primary text-inverse py-16">
      <div className="container">
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">CUSTOMER CARE</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Contact Us</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">FAQs</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Shipping Information</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">SERVICES</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Download the App</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Personal Shopping</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Click & Collect</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">ABOUT LITTLE DUBAI</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Our Story</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Sustainability</Link></li>
              <li><Link href="#" className="text-inverse opacity-75 hover:opacity-100">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">CONNECT WITH US</h3>
            <div className="flex gap-4" style={{ display: 'flex', gap: '1rem' }}>
              <Link href="#" className="text-inverse opacity-75 hover:opacity-100">Instagram</Link>
              <Link href="#" className="text-inverse opacity-75 hover:opacity-100">Facebook</Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 pt-8 border-t border-secondary opacity-50">
          <p className="text-xs">© 2026 Little Dubai. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
