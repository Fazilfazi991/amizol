'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Save, AlertCircle, Loader2 } from 'lucide-react';

export default function InventoryManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [status, setStatus] = useState('in_stock');
  const [stockCount, setStockCount] = useState<number | string>('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers',
    'mens-watches', 'womens-watches1', 'wallets', 'glasses', 'belts', 'heels'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setProducts([]);
    try {
      let allFound: any[] = [];
      for (const cat of categories) {
        const res = await fetch(`/littledubai-${cat}.json`);
        if (res.ok) {
          const data = await res.json();
          const filtered = data.products.filter((p: any) => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            String(p.id).includes(searchQuery)
          );
          allFound = [...allFound, ...filtered.map((p: any) => ({ ...p, category: cat }))];
        }
        if (allFound.length > 20) break; // Limit search results
      }
      setProducts(allFound);
    } catch (error) {
      console.error('Search error:', error);
      setMessage({ type: 'error', text: 'Failed to search products' });
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = async (product: any) => {
    setSelectedProduct(product);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_inventory')
        .select('*')
        .eq('product_id', String(product.id))
        .single();

      if (data) {
        setStatus(data.status);
        setStockCount(data.stock_count || '');
      } else {
        setStatus('in_stock');
        setStockCount('');
      }
    } catch (error) {
      console.error('Fetch status error:', error);
      setStatus('in_stock');
      setStockCount('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase
        .from('product_inventory')
        .upsert({
          product_id: String(selectedProduct.id),
          status,
          stock_count: stockCount === '' ? null : Number(stockCount),
          updated_at: new Date().toISOString()
        }, { onConflict: 'product_id' });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Inventory updated successfully!' });
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save changes' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-manager">
      <div className="inventory-grid">
        <div className="inventory-sidebar">
          <form onSubmit={handleSearch} className="search-box">
            <input 
              type="text" 
              placeholder="Search product name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            </button>
          </form>

          <div className="product-list">
            {products.length === 0 && !loading && (
              <p className="empty-msg">Search for a product to manage its stock</p>
            )}
            {products.map((p) => (
              <div 
                key={p.id} 
                className={`product-item ${selectedProduct?.id === p.id ? 'active' : ''}`}
                onClick={() => selectProduct(p)}
              >
                <div className="product-item__img">
                  <img src={p.image_urls?.[0] || p.images?.[0]} alt="" />
                </div>
                <div className="product-item__info">
                  <div className="product-item__name">{p.title}</div>
                  <div className="product-item__id">ID: {p.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="inventory-form-container">
          {selectedProduct ? (
            <div className="inventory-form">
              <div className="form-header">
                <img src={selectedProduct.image_urls?.[0] || selectedProduct.images?.[0]} alt="" />
                <div>
                  <h2>{selectedProduct.title}</h2>
                  <p>Category: {selectedProduct.category}</p>
                </div>
              </div>

              <div className="form-group">
                <label>Availability Status</label>
                <div className="status-options">
                  <button 
                    className={`status-btn ${status === 'in_stock' ? 'active in-stock' : ''}`}
                    onClick={() => setStatus('in_stock')}
                  >
                    In Stock
                  </button>
                  <button 
                    className={`status-btn ${status === 'limited_stock' ? 'active limited' : ''}`}
                    onClick={() => setStatus('limited_stock')}
                  >
                    Limited Stock
                  </button>
                  <button 
                    className={`status-btn ${status === 'out_of_stock' ? 'active out-of-stock' : ''}`}
                    onClick={() => setStatus('out_of_stock')}
                  >
                    No Stock / Sold Out
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Stock Count (Optional)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5" 
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                />
                <p className="hint">Numeric value shown to customers for limited stock</p>
              </div>

              <button className="btn btn--primary btn--full save-btn" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                SAVE CHANGES
              </button>

              {message.text && (
                <div className={`form-message ${message.type}`}>
                  {message.type === 'error' ? <AlertCircle size={18} /> : null}
                  {message.text}
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <Package size={48} />
              <p>Select a product from the list to manage its inventory settings.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .inventory-manager {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          height: calc(100vh - 200px);
        }
        .inventory-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          height: 100%;
        }
        .inventory-sidebar {
          border-right: 1px solid #eee;
          display: flex;
          flex-direction: column;
        }
        .search-box {
          padding: 20px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #eee;
        }
        .search-box input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }
        .search-box button {
          padding: 10px;
          background: #000;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .product-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        .empty-msg {
          text-align: center;
          color: #888;
          padding: 40px 20px;
        }
        .product-item {
          display: flex;
          gap: 15px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 5px;
        }
        .product-item:hover {
          background: #f8f8f8;
        }
        .product-item.active {
          background: #f0f0f0;
          border: 1px solid #ddd;
        }
        .product-item__img {
          width: 50px;
          height: 50px;
          border-radius: 4px;
          overflow: hidden;
          background: #f5f5f5;
        }
        .product-item__img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-item__name {
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 230px;
        }
        .product-item__id {
          font-size: 12px;
          color: #888;
        }
        .inventory-form-container {
          padding: 40px;
          background: #fafafa;
          overflow-y: auto;
        }
        .no-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #aaa;
          gap: 20px;
        }
        .inventory-form {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .form-header {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        .form-header img {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
        }
        .form-header h2 {
          margin: 0;
          font-size: 20px;
        }
        .form-group {
          margin-bottom: 25px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .status-options {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
        }
        .status-btn {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        .status-btn:hover {
          background: #f5f5f5;
        }
        .status-btn.active.in-stock {
          background: #e6f7ed;
          border-color: #22c55e;
          color: #166534;
          font-weight: 600;
        }
        .status-btn.active.limited {
          background: #fff7ed;
          border-color: #f97316;
          color: #9a3412;
          font-weight: 600;
        }
        .status-btn.active.out-of-stock {
          background: #fef2f2;
          border-color: #ef4444;
          color: #991b1b;
          font-weight: 600;
        }
        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }
        .hint {
          font-size: 12px;
          color: #888;
          margin-top: 5px;
        }
        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        .form-message {
          margin-top: 20px;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        .form-message.success {
          background: #e6f7ed;
          color: #166534;
        }
        .form-message.error {
          background: #fef2f2;
          color: #991b1b;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
