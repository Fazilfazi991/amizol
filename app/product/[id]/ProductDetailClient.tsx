'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Heart, MessageCircle, Share2 } from 'lucide-react';
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
  const brand = initialProduct.vendor || initialProduct.brandName || 'Little Dubai';
  const images = initialProduct.image_urls || initialProduct.images || [];
  const price = initialProduct.price;
  const [activeImage, setActiveImage] = useState(images[0] || '/images/placeholder.png');

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
    <div className="container py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Gallery Section */}
        <div className="flex flex-col-reverse md:flex-row gap-6 sticky top-24">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24">
            {images.slice(0, 6).map((img: string, idx: number) => (
              <button 
                key={idx} 
                className={`relative aspect-[3/4] md:aspect-square w-20 md:w-full flex-shrink-0 border transition-all ${activeImage === img ? 'border-primary' : 'border-light opacity-60 hover:opacity-100'}`}
                onClick={() => setActiveImage(img)}
              >
                <Image src={img} alt={`${name} ${idx}`} fill className="object-contain p-2" />
              </button>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 relative aspect-[3/4] bg-tertiary overflow-hidden group">
            <Image 
              src={activeImage} 
              alt={name} 
              fill 
              className="object-contain p-8 transition-transform duration-700 group-hover:scale-110" 
              priority
            />
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
        <div className="flex flex-col gap-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-secondary tracking-[0.2em] text-xs uppercase font-bold">{brand}</span>
              {stockStatus.status === 'limited_stock' && (
                <span className="text-error text-[10px] font-bold uppercase tracking-widest bg-error/5 px-2 py-1">Only {stockStatus.count} left</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display leading-[1.1] mb-6 uppercase tracking-tight">{name}</h1>
            <p className="text-3xl font-semibold">AED {price}</p>
          </div>

          <div className="py-10 border-y border-light">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">Select Size (EU)</label>
                <button className="text-[10px] font-bold tracking-widest text-accent border-b border-accent uppercase">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {['39', '40', '41', '42', '43', '44', '45', '46'].map((size) => (
                  <button 
                    key={size}
                    className={`h-12 border text-sm font-medium transition-all ${selectedSize === `EU ${size}` ? 'bg-primary text-white border-primary' : 'bg-white border-light hover:border-secondary'}`}
                    onClick={() => setSelectedSize(`EU ${size}`)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
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
          </div>

          <div className="grid sm:grid-cols-2 gap-8 pt-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-tertiary flex items-center justify-center shrink-0">
                <Truck size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide mb-1 uppercase">Free Delivery</p>
                <p className="text-secondary text-xs leading-relaxed">Express delivery across the UAE within 24-48 hours.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-tertiary flex items-center justify-center shrink-0">
                <ShieldCheck size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide mb-1 uppercase">100% Authentic</p>
                <p className="text-secondary text-xs leading-relaxed">Guaranteed authentic luxury products sourced from authorized retailers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
