'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, subtotal, setIsOpen } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ShoppingBag size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>YOUR BAG IS EMPTY</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>Looks like you haven&apos;t added anything to your bag yet.</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/category/men" className="btn btn--primary">SHOP MEN</Link>
          <Link href="/category/women" className="btn btn--secondary">SHOP WOMEN</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '2rem' }}>
        YOUR BAG ({cart.length} {cart.length === 1 ? 'item' : 'items'})
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.map((item, index) => (
            <div key={`${item.id}-${index}`} style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr auto',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
            }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', background: 'var(--color-bg-secondary)', borderRadius: '4px' }}>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="100px"
                />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  {item.brand}
                </p>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Size: {item.size}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>AED {item.price}</p>
                <button
                  onClick={() => removeFromCart(index)}
                  style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          padding: '2rem',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          background: 'var(--color-bg-secondary)',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1.5rem' }}>ORDER SUMMARY</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="text-secondary">Subtotal</span>
            <span>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span className="text-secondary">Delivery</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>Total</span>
            <span>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <Link
            href="/checkout"
            className="btn btn--primary btn--full btn--lg"
            style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}
          >
            PROCEED TO CHECKOUT
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
            Cash on Delivery · Free Express Delivery · 30-Day Returns
          </p>
        </div>
      </div>
    </div>
  );
}
