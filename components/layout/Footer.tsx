'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-primary text-inverse py-16">
      <div className="container">
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">CUSTOMER CARE</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/contact" className="text-inverse opacity-75 hover:opacity-100">Contact Us</Link></li>
              <li><Link href="/faq" className="text-inverse opacity-75 hover:opacity-100">FAQs</Link></li>
              <li><Link href="/shipping" className="text-inverse opacity-75 hover:opacity-100">Shipping Information</Link></li>
              <li><Link href="/returns" className="text-inverse opacity-75 hover:opacity-100">Returns &amp; Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">SHOP</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/category/men" className="text-inverse opacity-75 hover:opacity-100">Men</Link></li>
              <li><Link href="/category/women" className="text-inverse opacity-75 hover:opacity-100">Women</Link></li>
              <li><Link href="/brands" className="text-inverse opacity-75 hover:opacity-100">All Brands</Link></li>
              <li><Link href="/category/new-arrivals" className="text-inverse opacity-75 hover:opacity-100">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">ABOUT LITTLE DUBAI</h3>
            <ul className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/about" className="text-inverse opacity-75 hover:opacity-100">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-inverse opacity-75 hover:opacity-100">Sustainability</Link></li>
              <li><Link href="/contact" className="text-inverse opacity-75 hover:opacity-100">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-uppercase mb-6">CONNECT WITH US</h3>
            <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="https://www.instagram.com/littledubai_official" target="_blank" rel="noopener noreferrer" className="text-inverse opacity-75 hover:opacity-100">Instagram</a>
              <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer" className="text-inverse opacity-75 hover:opacity-100">WhatsApp</a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-inverse opacity-75 hover:opacity-100">Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 pt-8 border-t border-secondary opacity-50">
          <p className="text-xs">© {currentYear} Little Dubai. All Rights Reserved. | UAE</p>
        </div>
      </div>
    </footer>
  );
}
