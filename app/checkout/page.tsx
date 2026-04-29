'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Truck, CheckCircle, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_address: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}`,
            order_items: cart,
            total_price: subtotal,
            status: 'Pending',
            payment_method: paymentMethod
          }
        ]);

      if (error) throw error;

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: '10vh' }}>
        <CheckCircle size={64} style={{ color: 'var(--color-success)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Order Confirmed!</h1>
        <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
          Thank you for your order. We've received your details and our team will connect with you shortly to arrange delivery.
        </p>
        <div style={{ padding: '1.5rem', background: 'var(--color-bg-secondary)', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left', width: '100%', maxWidth: '400px' }}>
          <p className="text-sm text-secondary mb-2">Order Information:</p>
          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Total:</strong> AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p><strong>Payment Method:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
        </div>
        <Link href="/" className="btn btn--primary btn--lg">CONTINUE SHOPPING</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container section text-center" style={{ minHeight: '50vh', paddingTop: '10vh' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>YOUR BAG IS EMPTY</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>Please add some items to your bag before checking out.</p>
        <Link href="/" className="btn btn--primary">RETURN TO SHOP</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem 6rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/cart" className="text-sm font-bold flex items-center" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
          <ChevronLeft size={16} /> RETURN TO CART
        </Link>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .checkout-layout { grid-template-columns: 1.2fr 0.8fr !important; }
          }
        `}} />
        <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
          
          {/* Left Column - Forms */}
          <div>
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>
            
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="mb-10">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Contact Information</h2>
                <div className="form-group mb-4">
                  <label className="form-label form-label--required text-xs">EMAIL</label>
                  <input type="email" name="email" required className="form-input" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label form-label--required text-xs">MOBILE NUMBER</label>
                  <input type="tel" name="phone" required className="form-input" placeholder="+971 50 000 0000" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-10">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Shipping Address</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label form-label--required text-xs">FIRST NAME</label>
                    <input type="text" name="firstName" required className="form-input" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label form-label--required text-xs">LAST NAME</label>
                    <input type="text" name="lastName" required className="form-input" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label form-label--required text-xs">ADDRESS</label>
                  <input type="text" name="address" required className="form-input" placeholder="Street Address, Area" value={formData.address} onChange={handleInputChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group mb-0">
                    <label className="form-label text-xs">APARTMENT, SUITE, ETC. (OPTIONAL)</label>
                    <input type="text" name="apartment" className="form-input" placeholder="Apt, Suite" value={formData.apartment} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label form-label--required text-xs">CITY</label>
                    <input type="text" name="city" required className="form-input" placeholder="Dubai" value={formData.city} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label className="form-label text-xs">COUNTRY/REGION</label>
                  <div className="form-input flex items-center bg-gray-50" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' }}>United Arab Emirates</div>
                </div>
              </div>

              {/* Payment */}
              <div className="mb-10">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b">Payment Method</h2>
                
                <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', background: paymentMethod === 'cod' ? 'var(--color-bg-secondary)' : 'transparent', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ width: '18px', height: '18px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <Truck size={20} />
                      <span className="font-bold">Cash on Delivery</span>
                    </div>
                  </div>
                  
                  <div 
                    style={{ padding: '1rem', cursor: 'pointer', background: paymentMethod === 'card' ? 'var(--color-bg-secondary)' : 'transparent', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ width: '18px', height: '18px' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                      <CreditCard size={20} />
                      <span className="font-bold">Credit/Debit Card</span>
                    </div>
                  </div>
                </div>
                {paymentMethod === 'card' && (
                  <div style={{ padding: '1.5rem', background: 'var(--color-bg-secondary)', marginTop: '0.5rem', borderRadius: '4px' }}>
                    <p className="text-sm text-secondary">Card payments are simulated in this demo. Your order will be placed successfully without real charge.</p>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn--primary btn--full btn--lg mt-4" disabled={isProcessing}>
                {isProcessing ? 'PROCESSING...' : `PAY AED ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div style={{ position: 'sticky', top: '100px', background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '4px' }}>
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              
              <div className="mb-6 flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '64px', height: '64px', background: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                      <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', color: 'white', fontSize: '0.75rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>1</span>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h4 className="font-bold text-sm" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h4>
                      <p className="text-xs text-secondary">{item.brand} | Size: {item.size}</p>
                    </div>
                    <div className="font-bold text-sm whitespace-nowrap">
                      AED {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-bold">AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-secondary">Shipping</span>
                  <span className="font-bold text-success" style={{ color: 'var(--color-success)' }}>FREE</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold">AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
