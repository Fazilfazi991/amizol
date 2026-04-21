'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, setIsOpen } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <button className="header__mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="header__logo">
            <Link href="/">LITTLE DUBAI</Link>
          </div>

          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item group">
                <Link href="/category/men" className="header__nav-link">
                  MEN <ChevronDown size={14} />
                </Link>
                <div className="mega-menu">
                   <div className="container mega-menu__grid">
                      <div className="mega-menu__column">
                         <h3 className="mega-menu__title">SHOES</h3>
                         <ul className="mega-menu__list">
                            <li><Link href="/category/mens-shoes">All Shoes</Link></li>
                            <li><Link href="/brands/nike">Nike</Link></li>
                            <li><Link href="/brands/adidas">Adidas</Link></li>
                            <li><Link href="/brands/gucci">Gucci</Link></li>
                         </ul>
                      </div>
                      <div className="mega-menu__column">
                         <h3 className="mega-menu__title">BAGS</h3>
                         <ul className="mega-menu__list">
                            <li><Link href="/category/mens-bags">All Bags</Link></li>
                            <li><Link href="/brands/louis-vuitton">Louis Vuitton</Link></li>
                            <li><Link href="/brands/prada">Prada</Link></li>
                         </ul>
                      </div>
                   </div>
                </div>
              </li>
              <li className="header__nav-item group">
                <Link href="/category/women" className="header__nav-link">
                  WOMEN <ChevronDown size={14} />
                </Link>
                {/* Women Mega Menu... */}
              </li>
              <li className="header__nav-item">
                <Link href="/brands" className="header__nav-link">BRANDS</Link>
              </li>
              <li className="header__nav-item">
                <Link href="/category/new-arrivals" className="header__nav-link">NEW ARRIVALS</Link>
              </li>
            </ul>
          </nav>

          <div className="header__actions">
            <button className="header__action-btn"><Search size={20} /></button>
            <button className="header__action-btn"><User size={20} /></button>
            <button className="header__action-btn" onClick={() => setIsOpen(true)}>
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="header__action-badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav__header">
          <div className="header__logo">LITTLE DUBAI</div>
          <button className="mobile-nav__close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className="mobile-nav__list">
            <li><Link href="/category/men">MEN</Link></li>
            <li><Link href="/category/women">WOMEN</Link></li>
            <li><Link href="/brands">BRANDS</Link></li>
            <li><Link href="/admin">ADMIN</Link></li>
        </ul>
      </div>
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    </header>
  );
}
