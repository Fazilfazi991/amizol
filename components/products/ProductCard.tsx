import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';

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

  const [stockStatus, setStockStatus] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchStock() {
      const { data } = await supabase
        .from('product_inventory')
        .select('status, stock_count')
        .eq('product_id', String(product.id))
        .single();
      if (data) setStockStatus(data);
    }
    fetchStock();
  }, [product.id]);

  return (
    <div className={`product-card ${stockStatus?.status === 'out_of_stock' ? 'out-of-stock' : ''}`}>
      <Link href={`/product/${product.id}?source=${product.source || 'mens'}`} className="product-card__link">
        <div className="product-card__image-container">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="product-card__image" 
          />
          {stockStatus?.status === 'out_of_stock' && (
            <div className="product-card__status-overlay">SOLD OUT</div>
          )}
          {stockStatus?.status === 'limited_stock' && (
            <div className="product-card__status-badge">ONLY {stockStatus.stock_count || 5} LEFT</div>
          )}
          {!stockStatus || stockStatus.status !== 'out_of_stock' && (
            <button className="product-card__add" title="Quick Add" onClick={handleQuickAdd}>
              <ShoppingBag size={18} />
            </button>
          )}
        </div>
        <div className="product-card__info">
          <h3 className="product-card__title">{product.name}</h3>
          <p className="product-card__price">AED {product.price}</p>
        </div>
      </Link>
    </div>
  );
}
