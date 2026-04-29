'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart, setIsOpen } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header__top">
        <div className="container header__top-inner">
          <div className="header__top-left">
            <button className="header__top-link cursor-pointer bg-transparent border-none p-0" onClick={() => alert('Language features coming soon')}>UAE / العربية</button>
          </div>
          <div className="header__top-right">
            <Link href="/track" className="header__top-link">Track Order</Link>
            <span className="header__top-divider"></span>
            <Link href="/login" className="header__top-link">Sign In / Register</Link>
          </div>
        </div>
      </div>

      <div className="header__main container">
        <div className="header__inner">
          <button className="header__mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="header__logo">
            <Link href="/">LITTLE DUBAI</Link>
          </div>

          <div className="header__search">
            <div className="header__search-container">
              <Search size={18} className="header__search-icon" />
              <input 
                type="text" 
                className="header__search-input" 
                placeholder="Search brands, products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="header__actions flex items-center gap-6">
            <button className="header__action-btn" title="Account">
              <User size={20} />
            </button>
            <button className="header__action-btn" title="Wishlist">
              <Heart size={20} />
            </button>
            <button className="header__action-btn" onClick={() => setIsOpen(true)} title="Bag">
              <div className="header__cart-icon-wrapper">
                <ShoppingBag size={20} />
                {cart.length > 0 && <span className="header__action-badge">{cart.length}</span>}
              </div>
            </button>
          </div>
        </div>
      </div>

      <nav className="header__nav container">
        <ul className="header__nav-list">
          <li className="header__nav-item dropdown group">
            <Link href="/category/shoes" className="header__nav-link">
              SHOES <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="dropdown__menu">
              <Link href="/category/mens-shoes" className="dropdown__item">Mens Shoes</Link>
              <Link href="/category/womens-shoes" className="dropdown__item">Womens Shoes</Link>
            </div>
          </li>
          
          <li className="header__nav-item dropdown group">
            <Link href="/category/slippers" className="header__nav-link">
              SLIPPERS <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="dropdown__menu">
              <Link href="/category/mens-slippers" className="dropdown__item">Mens Slippers</Link>
              <Link href="/category/womens-slippers" className="dropdown__item">Womens Slippers</Link>
            </div>
          </li>

          <li className="header__nav-item dropdown group">
            <Link href="/category/men" className="header__nav-link">
              MEN <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="mega-menu">
              <div className="mega-menu__grid">
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">SHOES</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/mens-shoes">All Mens Shoes</Link></li>
                    <li><Link href="/brands/nike">Nike</Link></li>
                    <li><Link href="/brands/adidas">Adidas</Link></li>
                    <li><Link href="/brands/gucci">Gucci</Link></li>
                    <li><Link href="/brands/prada">Prada</Link></li>
                  </ul>
                </div>
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">SLIPPERS</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/mens-slippers">All Slippers</Link></li>
                    <li><Link href="/brands/hermes">Hermes</Link></li>
                    <li><Link href="/brands/loro-piana">Loro Piana</Link></li>
                  </ul>
                </div>
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">BAGS & ACCESSORIES</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/mens-bags">Bags</Link></li>
                    <li><Link href="/category/mens-watches">Watches</Link></li>
                    <li><Link href="/category/wallets">Wallets</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>

          <li className="header__nav-item dropdown group">
            <Link href="/category/women" className="header__nav-link">
              WOMEN <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="mega-menu">
              <div className="mega-menu__grid">
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">SHOES</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/womens-shoes">All Womens Shoes</Link></li>
                    <li><Link href="/brands/christian-louboutin">Christian Louboutin</Link></li>
                    <li><Link href="/brands/gucci">Gucci</Link></li>
                    <li><Link href="/brands/dior">Dior</Link></li>
                    <li><Link href="/brands/prada">Prada</Link></li>
                  </ul>
                </div>
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">SLIPPERS</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/womens-slippers">All Slippers</Link></li>
                    <li><Link href="/brands/hermes">Hermes</Link></li>
                    <li><Link href="/brands/loro-piana">Loro Piana</Link></li>
                  </ul>
                </div>
                <div className="mega-menu__column">
                  <h3 className="mega-menu__title">BAGS & ACCESSORIES</h3>
                  <ul className="mega-menu__list">
                    <li><Link href="/category/womens-bags">Bags</Link></li>
                    <li><Link href="/category/womens-watches">Watches</Link></li>
                    <li><Link href="/category/wallets">Wallets</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>

          <li className="header__nav-item dropdown group">
            <Link href="/category/accessories" className="header__nav-link">
              ACCESSORIES <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="dropdown__menu">
              <Link href="/category/wallets" className="dropdown__item">Wallets</Link>
              <Link href="/category/glasses" className="dropdown__item">Glasses</Link>
              <Link href="/category/belts" className="dropdown__item">Belts</Link>
            </div>
          </li>

          <li className="header__nav-item dropdown group">
            <Link href="/brands" className="header__nav-link">
              BRANDS <ChevronDown size={14} className="nav-chevron" />
            </Link>
            <div className="dropdown__menu dropdown__menu--columns">
              <Link href="/brands/adidas" className="dropdown__item">Adidas</Link>
              <Link href="/brands/new-balance" className="dropdown__item">New Balance</Link>
              <Link href="/brands/on-cloud" className="dropdown__item">On Cloud</Link>
              <Link href="/brands/asics" className="dropdown__item">Asics</Link>
              <Link href="/brands/hoka" className="dropdown__item">Hoka</Link>
              <Link href="/brands/puma" className="dropdown__item">Puma</Link>
              <Link href="/brands/timberland" className="dropdown__item">Timberland</Link>
              <Link href="/brands/onitsuka-tiger" className="dropdown__item">Onitsuka Tiger</Link>
              <Link href="/brands/travis-scott" className="dropdown__item">Travis Scott</Link>
              <Link href="/brands/louis-vuitton" className="dropdown__item">Louis Vuitton</Link>
              <Link href="/brands/gucci" className="dropdown__item">Gucci</Link>
              <Link href="/brands/dior" className="dropdown__item">Dior</Link>
              <Link href="/brands/prada" className="dropdown__item">Prada</Link>
              <Link href="/brands/hermes" className="dropdown__item">Hermes</Link>
              <Link href="/brands/balenciaga" className="dropdown__item">Balenciaga</Link>
              <Link href="/brands/amiri" className="dropdown__item">Amiri</Link>
              <Link href="/brands/christian-louboutin" className="dropdown__item">Christian Louboutin</Link>
              <Link href="/brands/alexander-mcqueen" className="dropdown__item">Alexander McQueen</Link>
              <Link href="/brands/golden-goose" className="dropdown__item">Golden Goose</Link>
              <Link href="/brands/zegna" className="dropdown__item">Zegna</Link>
              <Link href="/brands/loro-piana" className="dropdown__item">Loro Piana</Link>
              <Link href="/brands/dolce-gabbana" className="dropdown__item">Dolce & Gabbana</Link>
            </div>
          </li>
        </ul>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav__header">
          <div className="header__logo">LITTLE DUBAI</div>
          <button className="mobile-nav__close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="mobile-nav__body">
          <div className="mobile-nav__search">
            <Search size={18} className="mobile-nav__search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="mobile-nav__search-input" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <ul className="mobile-nav__list">
            <li><Link href="/category/mens-shoes" onClick={() => setIsMobileMenuOpen(false)}>MENS SHOES</Link></li>
            <li><Link href="/category/womens-shoes" onClick={() => setIsMobileMenuOpen(false)}>WOMENS SHOES</Link></li>
            <li><Link href="/category/men" onClick={() => setIsMobileMenuOpen(false)}>MEN</Link></li>
            <li><Link href="/category/women" onClick={() => setIsMobileMenuOpen(false)}>WOMEN</Link></li>
            <li><Link href="/brands" onClick={() => setIsMobileMenuOpen(false)}>BRANDS</Link></li>
            <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link></li>
          </ul>
        </div>
      </div>
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
    </header>
  );
}
