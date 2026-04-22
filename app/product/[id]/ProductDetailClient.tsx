'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, RotateCcw, Share2, Heart, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface Props {
  initialProduct: any;
  productId: string;
  source: string;
}

export default function ProductDetailClient({ initialProduct, productId, source }: Props) {
  const [selectedSize, setSelectedSize] = useState('EU 42');
  const { addToCart, setIsOpen } = useCart();
  
  if (!initialProduct) {
    return (
      <div className="container py-20 text-center">
        <h2>Product not found</h2>
        <p className="text-secondary mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="btn btn--primary">BACK TO HOME</Link>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState(initialProduct.image_urls?.[0] || initialProduct.images?.[0] || '/images/placeholder.png');

  const name = initialProduct.title || initialProduct.name;
  const brand = initialProduct.vendor || initialProduct.brandName || 'Designer';
  const images = initialProduct.image_urls || initialProduct.images || [];
  const price = initialProduct.price;

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name,
      price,
      image: activeImage,
      size: selectedSize,
      brand
    });
    setIsOpen(true);
  };

  const handleWhatsApp = () => {
    const message = `Hi Little Dubai, I'm interested in the ${brand} ${name} (Size: ${selectedSize}) - ${price}. Link: ${window.location.href}`;
    window.open(`https://wa.me/971500000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="container section">
      <div className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery__thumbnails">
            {images.slice(0, 5).map((img: string, idx: number) => (
              <div 
                key={idx} 
                className={`product-gallery__thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src={img} 
                    alt={`${name} thumb ${idx}`} 
                    fill 
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="product-gallery__main">
            <div style={{ position: 'relative', width: '100%', height: '600px' }}>
              <Image 
                src={activeImage} 
                alt={name} 
                fill 
                className="product-gallery__image object-contain" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="product-gallery__actions">
               <button className="icon-btn"><Share2 size={18} /></button>
               <button className="icon-btn"><Heart size={18} /></button>
            </div>
          </div>
        </div>

        <div className="product-info">
          <div className="product-info__header">
            <p className="product-info__brand">{brand}</p>
            <h1 className="product-info__title">{name}</h1>
          </div>
          
          <div className="product-info__price">
            <span>AED {price}</span>
            <span className="badge badge--success">In Stock</span>
          </div>
          
          <div className="product-info__options">
            <div className="product-info__option">
              <p className="product-info__option-label">SELECT SIZE (EU)</p>
              <div className="size-selector">
                {['40', '41', '42', '43', '44', '45'].map(size => (
                  <button 
                    key={size} 
                    className={`size-swatch__item ${selectedSize === `EU ${size}` ? 'size-swatch__item--selected' : ''}`}
                    onClick={() => setSelectedSize(`EU ${size}`)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="product-info__actions">
            <button className="btn btn--primary btn--full btn--lg" onClick={handleAddToCart}>
              ADD TO BAG
            </button>
            <button 
              className="btn btn--full btn--lg" 
              style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}
              onClick={handleWhatsApp}
            >
              <MessageCircle size={20} className="mr-2" /> ORDER ON WHATSAPP
            </button>
          </div>

          <div className="product-info__services">
            <div className="product-info__service">
              <Truck size={20} className="product-info__service-icon" />
              <div>
                <strong>Free Express Delivery</strong>
                <p className="text-xs text-muted">Delivery within 24-48 hours in UAE</p>
              </div>
            </div>
            <div className="product-info__service">
              <RotateCcw size={20} className="product-info__service-icon" />
              <div>
                <strong>Easy Returns</strong>
                <p className="text-xs text-muted">30-day free returns and exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
