import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'EU 42', // Default size for quick add
      brand: product.brand
    });
  };

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}?source=${product.source || 'mens'}`} className="product-card__link">
        <div className="product-card__image-container">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="product-card__image" 
          />
          <button className="product-card__add" title="Quick Add" onClick={handleQuickAdd}>
            <ShoppingBag size={18} />
          </button>
        </div>
        <div className="product-card__info">
          <p className="product-card__brand">{product.brand}</p>
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">AED {product.price}</p>
        </div>
      </Link>
    </div>
  );
}
