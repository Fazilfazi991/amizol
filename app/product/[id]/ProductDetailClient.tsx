'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Heart, MessageCircle, Share2, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';

interface Props {
  initialProduct: any;
  productId: string;
  source: string;
}

export default function ProductDetailClient({ initialProduct, productId, source }: Props) {
  const [selectedSize, setSelectedSize] = useState('EU 42');
  const [stockStatus, setStockStatus] = useState({ status: 'in_stock', count: null as number | null });
  const { addToCart, setIsOpen } = useCart();

  React.useEffect(() => {
    async function fetchStock() {
      try {
        const { data } = await supabase
          .from('product_inventory')
          .select('status, stock_count')
          .eq('product_id', productId)
          .single();

        if (data) {
          setStockStatus({ status: data.status, count: data.stock_count });
        }
      } catch (e) {
        console.error('Error fetching stock status:', e);
      }
    }
    fetchStock();
  }, [productId]);
  
  if (!initialProduct) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-3xl font-display mb-4">Product not found</h2>
        <p className="text-secondary mb-12">The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="btn btn--primary px-12">BACK TO HOME</Link>
      </div>
    );
  }

  const name = initialProduct.title || initialProduct.name;
  const brand = initialProduct.vendor || initialProduct.brandName || 'Designer';
  
  // Filter out duplicate cloud placeholders
  const rawImages = initialProduct.image_urls || initialProduct.images || [];
  const images = Array.isArray(rawImages) 
    ? rawImages.map(img => typeof img === 'string' ? img : img.src).filter((img: string) => img && !img.includes('31122025150715qXuhgIDHTMDE'))
    : [];

  const price = initialProduct.price;
  const [activeImage, setActiveImage] = useState(images[0] || '');
  const [imgError, setImgError] = useState(false);

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
    <div className="container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-6 text-[10px] uppercase tracking-widest text-secondary">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link href="/brands" className="hover:text-primary transition-colors">Brands</Link>
        <ChevronRight size={10} />
        <span className="text-primary font-bold">{brand}</span>
      </nav>

      <div className="pdp-container">
        {/* Gallery Section */}
        <div className="pdp-gallery">
          {/* Thumbnails */}
          <div className="pdp-gallery__thumbnails no-scrollbar">
            {images.slice(0, 5).map((img: string, idx: number) => (
              <div 
                key={idx} 
                className={`pdp-gallery__thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => {
                  setActiveImage(img);
                  setImgError(false);
                }}
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={img} 
                    alt={`${name} thumb ${idx}`} 
                    fill 
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="pdp-gallery__main relative bg-[#f8f8f8]">
            {!imgError && activeImage ? (
              <Image 
                src={activeImage} 
                alt={name} 
                fill 
                className="object-contain p-8" 
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
                <span className="text-[#999] uppercase tracking-[0.3em] text-sm font-light mb-4">{brand}</span>
                <span className="text-[#ccc] text-xs font-light">Image temporarily unavailable</span>
              </div>
            )}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="w-10 h-10 bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Heart size={20} />
              </button>
              <button className="w-10 h-10 bg-white shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
            {stockStatus.status === 'out_of_stock' && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-primary text-white px-8 py-4 font-bold text-xl tracking-widest uppercase">Sold Out</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="pdp-info">
          <div className="pdp-info__header">
            <p className="pdp-info__brand">{brand}</p>
            <h1 className="pdp-info__title">{name}</h1>
            <div className="flex items-baseline gap-4">
               <p className="pdp-info__price">AED {price}</p>
               {stockStatus.status === 'limited_stock' && (
                 <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error/5 px-2 py-1">
                   Only {stockStatus.count} left
                 </span>
               )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">Select Size (EU)</label>
              <button className="text-[10px] font-bold tracking-widest text-accent border-b border-accent uppercase hover:text-primary hover:border-primary transition-colors">Size Guide</button>
            </div>
            <div className="pdp-size-grid">
              {['39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                <button 
                  key={size}
                  className={`pdp-size-btn ${selectedSize === `EU ${size}` ? 'active' : ''}`}
                  onClick={() => setSelectedSize(`EU ${size}`)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-actions">
            <button 
              className={`btn btn--primary btn--lg w-full h-16 text-sm font-bold tracking-widest ${stockStatus.status === 'out_of_stock' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              disabled={stockStatus.status === 'out_of_stock'}
              onClick={handleAddToCart}
            >
              {stockStatus.status === 'out_of_stock' ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
            <button 
              className="btn btn--secondary btn--lg w-full h-16 text-sm font-bold tracking-widest border-2 flex items-center justify-center gap-3 hover:bg-success hover:border-success hover:text-white transition-all"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={20} />
              ORDER ON WHATSAPP
            </button>
          </div>

          <div className="pdp-services">
            <div className="pdp-service-item">
              <div className="pdp-service-icon">
                <Truck size={20} />
              </div>
              <div className="pdp-service-text">
                <h4>Free Delivery</h4>
                <p>Express delivery across the UAE within 24-48 hours.</p>
              </div>
            </div>
            <div className="pdp-service-item">
              <div className="pdp-service-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="pdp-service-text">
                <h4>100% Authentic</h4>
                <p>Guaranteed authentic luxury products sourced from authorized retailers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
