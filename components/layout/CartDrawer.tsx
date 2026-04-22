'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { supabase } from '@/lib/supabase';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, subtotal, removeFromCart, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_address: formData.address,
            order_items: cart,
            total_price: subtotal,
            status: 'Pending'
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

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => setIsSuccess(false), 300);
  };

  return (
    <>
      <div className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} onClick={closeDrawer}></div>
      <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h2>YOUR BAG</h2>
          <button className="cart-close-btn" onClick={closeDrawer}>
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="cart-success-msg active">
            <CheckCircle size={48} />
            <h3>Order Confirmed!</h3>
            <p>Thank you for your order. One of our team members will connect with you shortly to confirm your order and arrange Cash on Delivery.</p>
            <button className="btn btn--primary btn--full" onClick={closeDrawer}>CONTINUE SHOPPING</button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty-state">Your bag is empty</div>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={`${item.id}-${item.size}`}>
                    <img src={item.image} alt={item.name} className="cart-item__image" />
                    <div className="cart-item__details">
                      <div>
                        <div className="cart-item__title">{item.name}</div>
                        <div className="cart-item__meta">Size: {item.size}</div>
                      </div>
                      <div className="cart-item__price-row">
                        <div className="cart-item__price">{item.price}</div>
                        <button className="cart-item__remove" onClick={() => removeFromCart(index)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>AED {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <form className="checkout-form" onSubmit={handleSubmit}>
                  <div className="checkout-form__group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="checkout-form__group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+971 50 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="checkout-form__group">
                    <label>Delivery Address</label>
                    <textarea 
                      required 
                      placeholder="Villa/Apt No, Street, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={isProcessing}>
                    {isProcessing ? 'PROCESSING...' : 'PLACE ORDER (CASH ON DELIVERY)'}
                  </button>
                  <div className="checkout-cod-notice">
                    <Truck size={16} /> Pay only when you receive your order
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
