'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductProps {
  product: {
    id: string | number;
    name: string;
    brand: string;
    price: string;
    image: string;
    source?: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'EU 42' // Default size for quick add
    });
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}?source=${product.source || 'mens'}`} className="product-card__link">
        <div className="product-card__image-container">
          <img src={product.image} alt={product.name} className="product-card__image" />
          <button className="product-card__add" title="Quick Add" onClick={handleQuickAdd}>
            <ShoppingBag size={18} />
          </button>
        </div>
        <div className="product-card__info">
          <p className="product-card__brand">{product.brand}</p>
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">{product.price}</p>
        </div>
      </Link>
    </div>
  );
}
