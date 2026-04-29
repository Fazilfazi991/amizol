'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Save, AlertCircle, Loader2, Plus, Trash2, Edit3, X, Image as ImageIcon } from 'lucide-react';

export default function InventoryManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    handleSearch();
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    price: '',
    category: '',
    status: 'in_stock',
    stock_count: '' as string | number,
    images: [] as string[]
  });

  const categories = [
    'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers',
    'mens-watches', 'womens-watches1', 'wallets', 'glasses', 'belts', 'heels'
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // If it's a manual search and empty, don't proceed. 
    // But if it's the initial load (no event), allow it.
    if (e && !searchQuery.trim()) return;

    setLoading(true);
    try {
      // 1. Search in Supabase products table
      let query = supabase.from('products').select('*');
      
      if (searchQuery.trim()) {
        query = query.or(`id.ilike.%${searchQuery}%, name.ilike.%${searchQuery}%, brand.ilike.%${searchQuery}%`);
      }
      
      const { data: sbProducts, error: sbError } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (sbError) {
        console.error('SUPABASE ERROR:', sbError);
        setMessage({ type: 'error', text: `Database Error: ${sbError.message} (${sbError.code})` });
      } else {
        console.log('SUPABASE SUCCESS:', sbProducts?.length, 'products found');
      }

      // 2. Search in JSON files (fallback)
      let jsonFound: any[] = [];
      if ((!sbProducts || sbProducts.length < 5) && searchQuery.length > 2) {
        console.log('Searching JSON fallback...');
        for (const cat of categories) {
          try {
            const res = await fetch(`/littledubai-${cat}.json`);
            if (res.ok) {
              const data = await res.json();
              const filtered = data.products.filter((p: any) => 
                (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                String(p.id).includes(searchQuery)
              );
              jsonFound = [...jsonFound, ...filtered.map((p: any) => ({ 
                ...p, 
                name: p.title || p.name, 
                brand: p.vendor || p.brandName, 
                images: p.image_urls || p.images || [],
                category: cat, 
                source: 'json' 
              }))];
            }
          } catch (e) {
            console.warn(`JSON Fetch failed for ${cat}`);
          }
          if (jsonFound.length > 30) break;
        }
      }

      const merged = [...(sbProducts || [])];
      jsonFound.forEach(jp => {
        if (!merged.find(sp => String(sp.id) === String(jp.id))) {
          merged.push(jp);
        }
      });

      if (merged.length === 0 && !sbError) {
        setMessage({ type: 'info', text: 'No products found. Try a different search or add a new product.' });
      }

      setProducts(merged);
    } catch (error: any) {
      console.error('SYSTEM ERROR:', error);
      setMessage({ type: 'error', text: `System Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = async (product: any) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setIsAdding(false);
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_inventory')
        .select('*')
        .eq('product_id', String(product.id))
        .single();

      setFormData({
        id: String(product.id),
        name: product.title || product.name || '',
        brand: product.vendor || product.brandName || '',
        price: String(product.price || ''),
        category: product.category || '',
        status: data?.status || 'in_stock',
        stock_count: data?.stock_count || '',
        images: product.image_urls || product.images || []
      });
    } catch (error) {
      console.error('Fetch status error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      // 1. Save to product_inventory
      const { error: invError } = await supabase
        .from('product_inventory')
        .upsert({
          product_id: formData.id,
          status: formData.status,
          stock_count: formData.stock_count === '' ? null : Number(formData.stock_count),
          updated_at: new Date().toISOString()
        }, { onConflict: 'product_id' });

      if (invError) throw invError;

      // 2. Save to products table
      const { error: prodError } = await supabase
        .from('products')
        .upsert({
          id: formData.id,
          name: formData.name,
          brand: formData.brand,
          price: formData.price,
          category: formData.category,
          images: formData.images,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (prodError) throw prodError;

      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setIsEditing(false);
      setIsAdding(false);
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save changes' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will remove its inventory tracking.')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('product_inventory')
        .delete()
        .eq('product_id', id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Product tracking removed.' });
      setSelectedProduct(null);
      handleSearch();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-manager">
      <div className="inventory-grid">
        <div className="inventory-sidebar">
          <div className="sidebar-header">
            <form onSubmit={handleSearch} className="search-box">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                <Search size={18} />
              </button>
            </form>
            <button className="add-btn" onClick={() => { setIsAdding(true); setSelectedProduct({}); setFormData({ id: '', name: '', brand: '', price: '', category: '', status: 'in_stock', stock_count: '', images: [] }); }}>
              <Plus size={18} />
            </button>
          </div>

          <div className="product-list">
            {products.map((p) => (
              <div 
                key={p.id} 
                className={`product-item ${selectedProduct?.id === p.id ? 'active' : ''}`}
                onClick={() => selectProduct(p)}
              >
                <img src={p.image_urls?.[0] || p.images?.[0]} alt="" />
                <div className="product-item__info">
                  <div className="product-item__name">{p.title || p.name}</div>
                  <div className="product-item__id">ID: {p.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="inventory-main">
          {selectedProduct ? (
            <div className="product-editor">
              <div className="editor-header">
                <div className="header-info">
                  <img src={formData.images[0]} alt="" />
                  <div>
                    <h2>{isAdding ? 'Add New Product' : (isEditing ? 'Edit Product' : formData.name)}</h2>
                    <p className="product-id">ID: {formData.id}</p>
                  </div>
                </div>
                <div className="header-actions">
                  {!isEditing && !isAdding && (
                    <>
                      <button className="action-btn edit" onClick={() => setIsEditing(true)}><Edit3 size={18} /> Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(formData.id)}><Trash2 size={18} /></button>
                    </>
                  )}
                  {(isEditing || isAdding) && (
                    <button className="action-btn cancel" onClick={() => { setIsEditing(false); setIsAdding(false); if(isAdding) setSelectedProduct(null); }}><X size={18} /> Cancel</button>
                  )}
                </div>
              </div>

              <div className="editor-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing && !isAdding}
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input 
                      type="text" 
                      value={formData.brand} 
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      disabled={!isEditing && !isAdding}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (AED)</label>
                    <input 
                      type="text" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      disabled={!isEditing && !isAdding}
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      disabled={!isEditing && !isAdding}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Images (Comma separated URLs)</label>
                  <textarea 
                    value={formData.images.join(', ')} 
                    onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map(s => s.trim())})}
                    disabled={!isEditing && !isAdding}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    style={{ minHeight: '80px', padding: '12px', border: '1px solid #eee', borderRadius: '8px' }}
                  />
                  <div className="image-previews" style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {formData.images.map((url, i) => url && (
                      <img key={i} src={url} alt="" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                    ))}
                  </div>
                </div>

                <div className="form-divider">Inventory Settings</div>

                <div className="form-group">
                  <label>Availability Status</label>
                  <div className="status-toggle">
                    {['in_stock', 'limited_stock', 'out_of_stock'].map(s => (
                      <button 
                        key={s}
                        className={`status-chip ${formData.status === s ? 'active ' + s : ''}`}
                        onClick={() => setFormData({...formData, status: s})}
                      >
                        {s.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Exact Stock Count</label>
                  <input 
                    type="number" 
                    value={formData.stock_count} 
                    onChange={(e) => setFormData({...formData, stock_count: e.target.value})}
                    placeholder="Enter numeric stock count"
                  />
                </div>

                {(isEditing || isAdding || true) && (
                  <button className="save-btn" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    SAVE PRODUCT CHANGES
                  </button>
                )}

                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <ImageIcon size={64} opacity={0.2} />
              <p>Select a product to view or edit details</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .inventory-manager {
          height: calc(100vh - 120px);
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          overflow: hidden;
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
        .sidebar-header {
          padding: 20px;
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #eee;
        }
        .search-box {
          flex: 1;
          display: flex;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 0 12px;
        }
        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          height: 40px;
          outline: none;
          font-size: 14px;
        }
        .add-btn {
          width: 40px;
          height: 40px;
          background: #000;
          color: #fff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
        }
        .product-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .product-item:hover { background: #f8f8f8; }
        .product-item.active { background: #f0f0f0; }
        .product-item img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }
        .product-item__name {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        .product-item__id {
          font-size: 12px;
          color: #888;
        }

        .inventory-main {
          background: #fafafa;
          overflow-y: auto;
        }
        .product-editor {
          max-width: 800px;
          margin: 40px auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          padding: 40px;
        }
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 1px solid #eee;
          padding-bottom: 30px;
        }
        .header-info {
          display: flex;
          gap: 20px;
        }
        .header-info img {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
        }
        .header-info h2 {
          margin: 0 0 5px 0;
          font-size: 24px;
        }
        .product-id {
          color: #888;
          font-size: 14px;
        }
        .header-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid #eee;
        }
        .action-btn.edit { background: #fff; color: #000; }
        .action-btn.delete { color: #ef4444; border-color: #fee2e2; }
        .action-btn.delete:hover { background: #fef2f2; }
        .action-btn.cancel { background: #f5f5f5; color: #666; }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }
        .form-group input, .form-group select {
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          outline: none;
          font-size: 15px;
          transition: border 0.2s;
        }
        .form-group input:focus { border-color: #000; }
        
        .form-divider {
          margin: 40px 0 20px 0;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-weight: 700;
          font-size: 14px;
          color: #000;
        }

        .status-toggle {
          display: flex;
          gap: 10px;
        }
        .status-chip {
          flex: 1;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
        }
        .status-chip.active.in_stock { background: #e6f7ed; color: #166534; border-color: #22c55e; }
        .status-chip.active.limited_stock { background: #fff7ed; color: #9a3412; border-color: #f97316; }
        .status-chip.active.out_of_stock { background: #fef2f2; color: #991b1b; border-color: #ef4444; }

        .save-btn {
          width: 100%;
          background: #000;
          color: #fff;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
          cursor: pointer;
        }
        .save-btn:disabled { opacity: 0.5; }

        .message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          font-size: 14px;
          text-align: center;
        }
        .message.success { background: #e6f7ed; color: #166534; }
        .message.error { background: #fef2f2; color: #991b1b; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #aaa;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
