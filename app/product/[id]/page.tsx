'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ProductDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'mens';
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('EU 42');
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(\`/littledubai-\${source}.json\`);
        const data = await res.json();
        const found = data.products.find((p: any) => String(p.id) === String(id));
        if (found) {
          setProduct(found);
          setActiveImage(found.image_urls?.[0] || found.images?.[0]);
        }
      } catch (e) {
        console.error("Failed to fetch product", e);
      }
    }
    fetchData();
  }, [id, source]);

  if (!product) return <div className="container py-20 text-center">Loading product...</div>;

  const name = product.title || product.name;
  const brand = product.vendor || product.brandName || 'Designer';
  const images = product.image_urls || product.images || [];

  return (
    <div className="container section">
      <div className="product-detail" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
        <div className="product-gallery" style={{ display: 'flex', gap: '1rem' }}>
          <div className="product-gallery__thumbnails">
            {images.map((img: string, idx: number) => (
              <div 
                key={idx} 
                className={`product-gallery__thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={name} />
              </div>
            ))}
          </div>
          <div className="product-gallery__main">
            <img src={activeImage} alt={name} className="product-gallery__image" />
          </div>
        </div>

        <div className="product-info">
          <p className="product-info__brand">{brand}</p>
          <h1 className="product-info__title">{name}</h1>
          <div className="product-info__price">
            <span>{product.price}</span>
          </div>
          
          <div className="product-info__options">
            <div className="product-info__option">
              <p className="product-info__option-label">SELECT SIZE</p>
              <div className="btn-group">
                {['EU 40', 'EU 41', 'EU 42', 'EU 43'].map(size => (
                  <button 
                    key={size} 
                    className={`tag ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="product-info__actions">
            <button 
              className="btn btn--primary btn--full btn--lg"
              onClick={() => addToCart({
                name,
                price: product.price,
                image: activeImage,
                size: selectedSize
              })}
            >
              ADD TO CART
            </button>
            <button className="btn btn--secondary btn--full btn--lg" style={{ backgroundColor: '#25D366', color: 'white', borderColor: '#25D366' }}>
              ORDER NOW (WHATSAPP)
            </button>
          </div>

          <div className="product-info__services">
            <div className="product-info__service">
              <Truck size={20} className="product-info__service-icon" />
              <span>Free Express Delivery in UAE</span>
            </div>
            <div className="product-info__service">
              <RotateCcw size={20} className="product-info__service-icon" />
              <span>Free 30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
