'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Save, Loader2, Plus, Trash2, Edit3, X, Image as ImageIcon, Package } from 'lucide-react';

const CATEGORIES = [
  'mens-shoes', 'womens-shoes', 'mens-slippers', 'womens-slippers',
  'mens-watches', 'womens-watches1', 'wallets', 'glasses', 'belts', 'heels'
];

const CAT_LABELS: Record<string, string> = {
  'mens-shoes': "Men's Shoes", 'womens-shoes': "Women's Shoes",
  'mens-slippers': "Men's Slippers", 'womens-slippers': "Women's Slippers",
  'mens-watches': "Men's Watches", 'womens-watches1': "Women's Watches",
  'wallets': 'Wallets', 'glasses': 'Glasses', 'belts': 'Belts', 'heels': 'Heels'
};

export default function InventoryManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    id: '', name: '', brand: '', price: '', category: '',
    status: 'in_stock', stock_count: '' as string | number, images: [] as string[]
  });

  // Load all products once on mount
  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    setLoading(true);
    let all: any[] = [];

    // Load from all JSON files
    for (const cat of CATEGORIES) {
      try {
        const res = await fetch(`/littledubai-${cat}.json`);
        if (res.ok) {
          const data = await res.json();
          const products = (data.products || data || []) as any[];
          all = [...all, ...products.map((p: any) => ({
            ...p,
            name: p.title || p.name || '',
            brand: p.vendor || p.brandName || '',
            images: p.image_urls || p.images || [],
            category: cat,
            source: 'json'
          }))];
        }
      } catch { /* skip missing files */ }
    }

    // Overlay Supabase inventory status
    try {
      const { data: inv } = await supabase.from('product_inventory').select('*');
      if (inv && inv.length > 0) {
        const invMap = Object.fromEntries(inv.map((i: any) => [String(i.product_id), i]));
        all = all.map(p => ({
          ...p,
          status: invMap[String(p.id)]?.status,
          stock_count: invMap[String(p.id)]?.stock_count,
        }));
      }
    } catch { /* supabase optional */ }

    setAllProducts(all);
    setLoading(false);
  };

  // Client-side filtering — instant, no network needed
  const filteredProducts = useMemo(() => {
    let list = allProducts;
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        String(p.id).includes(q)
      );
    }
    return list;
  }, [allProducts, searchQuery, activeCategory]);

  const selectProduct = async (product: any) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setIsAdding(false);
    const { data } = await supabase
      .from('product_inventory').select('*').eq('product_id', String(product.id)).single();
    setFormData({
      id: String(product.id),
      name: product.name || '',
      brand: product.brand || '',
      price: String(product.price || ''),
      category: product.category || '',
      status: data?.status || 'in_stock',
      stock_count: data?.stock_count || '',
      images: product.images || []
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await supabase.from('product_inventory').upsert({
        product_id: formData.id,
        status: formData.status,
        stock_count: formData.stock_count === '' ? null : Number(formData.stock_count),
        updated_at: new Date().toISOString()
      }, { onConflict: 'product_id' });

      await supabase.from('products').upsert({
        id: formData.id, name: formData.name, brand: formData.brand,
        price: formData.price, category: formData.category, images: formData.images,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      // Update local state so UI reflects changes instantly
      setAllProducts(prev => prev.map(p =>
        String(p.id) === formData.id
          ? { ...p, name: formData.name, brand: formData.brand, status: formData.status }
          : p
      ));
      setMessage({ type: 'success', text: '✓ Product saved successfully!' });
      setIsEditing(false);
      setIsAdding(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove inventory tracking for this product?')) return;
    await supabase.from('product_inventory').delete().eq('product_id', id);
    setSelectedProduct(null);
    setAllProducts(prev => prev.map(p => String(p.id) === id ? { ...p, status: undefined } : p));
  };

  const statusColor = (s?: string) => s === 'in_stock' ? '#22c55e' : s === 'limited_stock' ? '#f97316' : s === 'out_of_stock' ? '#ef4444' : '#ccc';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#f8f9fa', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: 420, minWidth: 420, background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>

        {/* Search bar */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 10, padding: '0 14px', height: 42 }}>
              <Search size={16} color="#aaa" />
              <input
                type="text"
                placeholder="Search by name, brand, or ID…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: '#111' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: '#aaa', lineHeight: 1 }}>
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => { setIsAdding(true); setSelectedProduct({}); setFormData({ id: '', name: '', brand: '', price: '', category: '', status: 'in_stock', stock_count: '', images: [] }); }}
              style={{ width: 42, height: 42, background: '#000', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Category filter chips */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
            {['all', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  background: activeCategory === cat ? '#000' : '#f0f0f0',
                  color: activeCategory === cat ? '#fff' : '#555',
                  border: 'none', cursor: 'pointer'
                }}
              >
                {cat === 'all' ? 'All' : CAT_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
            {loading ? 'Loading products…' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}${searchQuery ? ` matching "${searchQuery}"` : ''}`}
          </div>
        </div>

        {/* Product list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#aaa', gap: 10 }}>
              <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Loading…
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
              <Package size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 14 }}>No products found</p>
            </div>
          ) : (
            filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => selectProduct(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                  cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                  background: selectedProduct?.id === p.id ? '#f0f4ff' : 'transparent',
                  borderLeft: selectedProduct?.id === p.id ? '3px solid #000' : '3px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 8, background: '#f5f5f5', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <Package size={20} color="#ccc" />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#111' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.brand} · {CAT_LABELS[p.category] || p.category}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>AED {p.price}</span>
                    {p.status && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: statusColor(p.status) }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(p.status), display: 'inline-block' }} />
                        {p.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {selectedProduct ? (
          <div style={{ maxWidth: 680, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 36, boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, background: '#f5f5f5', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {formData.images[0]
                    ? <img src={formData.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <ImageIcon size={28} color="#ccc" />
                  }
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{isAdding ? 'Add New Product' : formData.name || 'Product Details'}</h2>
                  <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>ID: {formData.id || '—'} · {CAT_LABELS[formData.category] || formData.category}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!isEditing && !isAdding && (
                  <>
                    <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #eee', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff' }}>
                      <Edit3 size={15} /> Edit
                    </button>
                    <button onClick={() => handleDelete(formData.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #fee2e2', fontSize: 13, color: '#ef4444', cursor: 'pointer', background: '#fff' }}>
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
                {(isEditing || isAdding) && (
                  <button onClick={() => { setIsEditing(false); setIsAdding(false); if (isAdding) setSelectedProduct(null); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #eee', fontSize: 13, background: '#f5f5f5', cursor: 'pointer' }}>
                    <X size={15} /> Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[['Product Name', 'name', 'text'], ['Brand', 'brand', 'text'], ['Price (AED)', 'price', 'text'], ['Category', 'category', 'text']].map(([label, key, type]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                  <input
                    type={type}
                    value={(formData as any)[key]}
                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                    disabled={!isEditing && !isAdding}
                    style={{ padding: '10px 12px', border: '1px solid #eee', borderRadius: 8, fontSize: 14, outline: 'none', background: (!isEditing && !isAdding) ? '#fafafa' : '#fff' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Images (comma-separated URLs)</label>
              <textarea
                value={formData.images.join(', ')}
                onChange={e => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                disabled={!isEditing && !isAdding}
                placeholder="https://cdn.example.com/image1.jpg, ..."
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #eee', borderRadius: 8, fontSize: 13, minHeight: 72, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: (!isEditing && !isAdding) ? '#fafafa' : '#fff' }}
              />
              {formData.images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  {formData.images.filter(Boolean).map((url, i) => (
                    <img key={i} src={url} alt="" style={{ width: 56, height: 56, borderRadius: 6, objectFit: 'contain', background: '#f5f5f5', border: '1px solid #eee' }} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 20, marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 10 }}>Availability Status</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['in_stock', '#22c55e', '#e6f7ed', '#166534'],
                  ['limited_stock', '#f97316', '#fff7ed', '#9a3412'],
                  ['out_of_stock', '#ef4444', '#fef2f2', '#991b1b']].map(([s, border, bg, color]) => (
                  <button
                    key={s}
                    onClick={() => setFormData({ ...formData, status: s })}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      border: `1px solid ${formData.status === s ? border : '#eee'}`,
                      background: formData.status === s ? bg : '#fff',
                      color: formData.status === s ? color : '#888'
                    }}
                  >
                    {s.replace(/_/g, ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>Stock Count</label>
              <input
                type="number"
                value={formData.stock_count}
                onChange={e => setFormData({ ...formData, stock_count: e.target.value })}
                placeholder="Leave blank for unlimited"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #eee', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ width: '100%', padding: '14px 0', background: '#000', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
              {saving ? 'Saving…' : 'SAVE CHANGES'}
            </button>

            {message.text && (
              <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 8, fontSize: 13, textAlign: 'center', background: message.type === 'success' ? '#e6f7ed' : '#fef2f2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
                {message.text}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ccc' }}>
            <ImageIcon size={64} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 15, color: '#aaa' }}>Select a product to view or edit details</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
