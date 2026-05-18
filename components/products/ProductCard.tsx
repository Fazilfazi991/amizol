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
  const [imgError, setImgError] = React.useState(false);

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
          {!imgError && product.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-card__image" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-[#f8f8f8] text-[#999] uppercase tracking-widest text-xs font-light">
              {product.brand || 'Amizol'}
            </div>
          )}
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
        <div className="product-card__info flex flex-col gap-1 mt-2">
          <h3 className="product-card__title mb-0">{product.name}</h3>
          <div className="flex items-center justify-between">
            <p className="product-card__price m-0">AED {product.price}</p>
            {stockStatus?.status === 'limited_stock' ? (
              <span className="text-[9px] font-bold uppercase tracking-widest text-error">Limited Stock</span>
            ) : stockStatus?.status === 'out_of_stock' ? (
              <span className="text-[9px] font-bold uppercase tracking-widest text-error">Out of Stock</span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5cb85c]">In Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
