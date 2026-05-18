'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const currentYear = new Date().getFullYear();

  if (isAdminPage) return null;

  return (
    <footer className="footer bg-primary text-inverse py-20">
      <div className="container">
        <div className="footer__grid">
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold tracking-widest text-uppercase mb-2">CUSTOMER CARE</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/contact" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Contact Us</Link></li>
              <li><Link href="/faq" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">FAQs</Link></li>
              <li><Link href="/shipping" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Shipping Information</Link></li>
              <li><Link href="/returns" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Returns &amp; Exchanges</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold tracking-widest text-uppercase mb-2">SHOP</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/category/men" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Men</Link></li>
              <li><Link href="/category/women" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Women</Link></li>
              <li><Link href="/brands" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">All Brands</Link></li>
              <li><Link href="/category/new-arrivals" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">New Arrivals</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold tracking-widest text-uppercase mb-2">ABOUT LITTLE DUBAI</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Our Story</Link></li>
              <li><Link href="/sustainability" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Sustainability</Link></li>
              <li><Link href="/contact" className="text-inverse opacity-70 hover:opacity-100 transition-opacity">Careers</Link></li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold tracking-widest text-uppercase mb-2">CONNECT WITH US</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/971500000000" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="text-center mt-16 pt-8 border-t border-white/10 opacity-50">
          <p className="text-xs">© {currentYear} Little Dubai. All Rights Reserved. | UAE</p>
        </div>
      </div>
    </footer>
  );
}
