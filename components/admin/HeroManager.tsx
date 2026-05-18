'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Save, Trash2, RefreshCw, Monitor, Smartphone, Plus, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Default hero config — used as fallback if Supabase has no row yet
const DEFAULT_HEROES = [
  // Categories
  { page_type: 'category', slug: 'mens-shoes',     label: "Men's Shoes",       desktop_url: '/images/mens-shoes-l.jpg',       mobile_url: '/images/mens-shoe-hero-m.png' },
  { page_type: 'category', slug: 'womens-shoes',   label: "Women's Shoes",     desktop_url: '/images/womens-shoes-l.jpg',     mobile_url: '/images/w2.jpg' },
  { page_type: 'category', slug: 'mens-bags',      label: "Men's Bags",        desktop_url: '/images/mens-shoe-hero-l.jpg',   mobile_url: '' },
  { page_type: 'category', slug: 'womens-bags',    label: "Women's Bags",      desktop_url: '/images/womens-bags-l.jpg',      mobile_url: '' },
  { page_type: 'category', slug: 'mens-slippers',  label: "Men's Slippers",    desktop_url: '/images/mens-slippers-l.jpg',   mobile_url: '/images/mens-slippers-hero-m.png' },
  { page_type: 'category', slug: 'womens-slippers',label: "Women's Slippers",  desktop_url: '/images/womens-slippers-l.jpg', mobile_url: '/images/womens-slippers-m.png' },
  { page_type: 'category', slug: 'mens-watches',   label: "Men's Watches",     desktop_url: '/images/mens-shoe-hero-l.jpg',  mobile_url: '' },
  { page_type: 'category', slug: 'womens-watches', label: "Women's Watches",   desktop_url: '/images/womens-shoes-l.jpg',    mobile_url: '' },
  { page_type: 'category', slug: 'wallets',        label: 'Wallets',           desktop_url: '/images/wallets-l.jpg',         mobile_url: '/images/wallets-hero-m.png' },
  { page_type: 'category', slug: 'glasses',        label: 'Glasses',           desktop_url: '/images/glasses-l.jpg',         mobile_url: '/images/glasses-hero-m.png' },
  { page_type: 'category', slug: 'belts',          label: 'Belts',             desktop_url: '/images/belts-l.jpg',           mobile_url: '/images/belts-hero-m.png' },
  // Brands
  { page_type: 'brand', slug: 'gucci',             label: 'Gucci',             desktop_url: '/images/gucci-l.jpg',           mobile_url: '/images/gucci-hero-m.png' },
  { page_type: 'brand', slug: 'prada',             label: 'Prada',             desktop_url: '/images/prada-l.jpg',           mobile_url: '/images/prada-hero-m.png' },
  { page_type: 'brand', slug: 'dior',              label: 'Dior',              desktop_url: '/images/dior-l.jpg',            mobile_url: '' },
  { page_type: 'brand', slug: 'louis-vuitton',     label: 'Louis Vuitton',     desktop_url: '/images/louis-vuitton-l.jpg',   mobile_url: '' },
  { page_type: 'brand', slug: 'hermes',            label: 'Hermès',            desktop_url: '/images/hermes-l.jpg',          mobile_url: '/images/hermes-hero-m.png' },
  { page_type: 'brand', slug: 'amiri',             label: 'Amiri',             desktop_url: '/images/amiri-l.jpg',           mobile_url: '' },
  { page_type: 'brand', slug: 'dolce-gabbana',     label: 'Dolce & Gabbana',   desktop_url: '/images/dolce-gabbana-l.jpg',   mobile_url: '' },
  { page_type: 'brand', slug: 'nike',              label: 'Nike',              desktop_url: '/images/nike-l.jpg',            mobile_url: '/images/nike-hero-m.png' },
  { page_type: 'brand', slug: 'hoka',              label: 'Hoka',              desktop_url: '/images/hoka-l.jpg',            mobile_url: '/images/hoka-hero-m.png' },
  { page_type: 'brand', slug: 'on-cloud',          label: 'On Cloud',          desktop_url: '/images/on-cloud-l.jpg',        mobile_url: '/images/on-cloud-hero-m.png' },
  { page_type: 'brand', slug: 'new-balance',       label: 'New Balance',       desktop_url: '/images/new-balance-l.jpg',     mobile_url: '' },
  { page_type: 'brand', slug: 'puma',              label: 'Puma',              desktop_url: '/images/puma-l.jpg',            mobile_url: '' },
  { page_type: 'brand', slug: 'timberland',        label: 'Timberland',        desktop_url: '/images/timberland-l.jpg',      mobile_url: '' },
  { page_type: 'brand', slug: 'golden-goose',      label: 'Golden Goose',      desktop_url: '/images/golden-goose-l.jpg',    mobile_url: '' },
  { page_type: 'brand', slug: 'travis-scott',      label: 'Travis Scott',      desktop_url: '/images/travis-scott-l.jpg',    mobile_url: '/images/travis-hero-m.png' },
  { page_type: 'brand', slug: 'zegna',             label: 'Zegna',             desktop_url: '/images/zegna-l.jpg',           mobile_url: '' },
];

type HeroRow = {
  id?: number;
  page_type: string;
  slug: string;
  label: string;
  desktop_url: string;
  mobile_url: string;
};

export default function HeroManager() {
  const [heroes, setHeroes] = useState<HeroRow[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<HeroRow>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'category' | 'brand'>('all');
  const [useDB, setUseDB] = useState(false);

  useEffect(() => {
    loadHeroes();
  }, []);

  async function loadHeroes() {
    try {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('page_type')
        .order('slug');

      if (!error && data && data.length > 0) {
        setHeroes(data);
        setUseDB(true);
      } else {
        // Table doesn't exist yet — use defaults
        setHeroes(DEFAULT_HEROES);
        setUseDB(false);
      }
    } catch {
      setHeroes(DEFAULT_HEROES);
      setUseDB(false);
    }
  }

  async function createTable() {
    // Insert all default rows into Supabase
    setSaving(true);
    try {
      const { error } = await supabase.from('hero_images').insert(DEFAULT_HEROES);
      if (error) throw error;
      setMessage('✅ Database initialized! You can now save changes permanently.');
      setUseDB(true);
      loadHeroes();
    } catch (e: any) {
      setMessage(`⚠️ Could not connect to DB: ${e.message}. Changes will be session-only.`);
    }
    setSaving(false);
  }

  function startEdit(hero: HeroRow) {
    setEditingSlug(hero.slug);
    setEditData({ ...hero });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setEditData({});
  }

  async function saveEdit() {
    if (!editData.slug) return;
    setSaving(true);

    if (useDB && editData.id) {
      const { error } = await supabase
        .from('hero_images')
        .update({
          desktop_url: editData.desktop_url,
          mobile_url: editData.mobile_url,
          label: editData.label,
        })
        .eq('id', editData.id);

      if (error) {
        setMessage(`❌ Error saving: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    // Update local state regardless
    setHeroes(prev =>
      prev.map(h => (h.slug === editData.slug ? { ...h, ...editData } : h))
    );
    setMessage(`✅ "${editData.label}" updated! ${useDB ? 'Saved to database.' : 'Note: No DB — changes are session-only.'}`);
    setEditingSlug(null);
    setSaving(false);
    setTimeout(() => setMessage(''), 4000);
  }

  async function deleteHero(hero: HeroRow) {
    if (!confirm(`Reset "${hero.label}" hero to default?`)) return;
    const defaultHero = DEFAULT_HEROES.find(d => d.slug === hero.slug);
    if (!defaultHero) return;

    if (useDB && hero.id) {
      await supabase.from('hero_images').update({
        desktop_url: defaultHero.desktop_url,
        mobile_url: defaultHero.mobile_url,
      }).eq('id', hero.id);
    }

    setHeroes(prev => prev.map(h => (h.slug === hero.slug ? { ...h, ...defaultHero } : h)));
    setMessage(`🔄 "${hero.label}" reset to default.`);
    setTimeout(() => setMessage(''), 3000);
  }

  const filtered = heroes.filter(h => filter === 'all' || h.page_type === filter);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Hero Image Manager</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Edit desktop & mobile hero images for all category and brand pages.
          </p>
        </div>
        {!useDB && (
          <button
            onClick={createTable}
            disabled={saving}
            style={{
              background: '#1a1a2e', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <Plus size={16} /> Enable DB Persistence
          </button>
        )}
      </div>

      {/* DB Status */}
      <div style={{
        background: useDB ? '#f0fdf4' : '#fffbeb',
        border: `1px solid ${useDB ? '#86efac' : '#fcd34d'}`,
        borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
        fontSize: '13px', color: useDB ? '#166534' : '#92400e'
      }}>
        {useDB
          ? '🟢 Connected to database — changes are saved permanently.'
          : '🟡 No database table found. Click "Enable DB Persistence" to save changes permanently, or edits will reset on page refresh.'}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['all', 'category', 'brand'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 18px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === f ? '#1a1a2e' : '#ddd',
              background: filter === f ? '#1a1a2e' : '#fff',
              color: filter === f ? '#fff' : '#555',
              cursor: 'pointer', fontSize: '13px', fontWeight: filter === f ? 600 : 400,
              textTransform: 'capitalize'
            }}
          >
            {f === 'all' ? 'All Pages' : f === 'category' ? 'Categories' : 'Brands'}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '20px', fontSize: '14px', color: '#0369a1'
        }}>
          {message}
        </div>
      )}

      {/* Hero Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filtered.map(hero => (
          <div
            key={hero.slug}
            style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}
          >
            {/* Preview strip */}
            <div style={{ height: '100px', background: '#111', position: 'relative', overflow: 'hidden' }}>
              {hero.desktop_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero.desktop_url}
                  alt={hero.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e: any) => { e.target.style.display = 'none'; }}
                />
              )}
              <div style={{
                position: 'absolute', top: '8px', left: '8px',
                background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 8px',
                borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                {hero.page_type}
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: 600, fontSize: '14px' }}>{hero.label}</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(hero)}
                    style={{ background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteHero(hero)}
                    style={{ background: '#fef2f2', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}
                    title="Reset to default"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {editingSlug === hero.slug ? (
                /* Edit form */
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                    <Monitor size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Desktop / Laptop Image URL
                  </label>
                  <input
                    value={editData.desktop_url || ''}
                    onChange={e => setEditData(d => ({ ...d, desktop_url: e.target.value }))}
                    placeholder="/images/my-hero-laptop.jpg"
                    style={{
                      width: '100%', padding: '8px 10px', border: '1.5px solid #d1d5db',
                      borderRadius: '6px', fontSize: '12px', marginBottom: '10px', boxSizing: 'border-box'
                    }}
                  />
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                    <Smartphone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Mobile Image URL (optional)
                  </label>
                  <input
                    value={editData.mobile_url || ''}
                    onChange={e => setEditData(d => ({ ...d, mobile_url: e.target.value }))}
                    placeholder="/images/my-hero-mobile.jpg"
                    style={{
                      width: '100%', padding: '8px 10px', border: '1.5px solid #d1d5db',
                      borderRadius: '6px', fontSize: '12px', marginBottom: '12px', boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      style={{
                        flex: 1, background: '#1a1a2e', color: '#fff', border: 'none',
                        padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        flex: 1, background: '#f3f4f6', color: '#374151', border: 'none',
                        padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display current URLs */
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <Monitor size={13} style={{ color: '#6b7280', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#374151', wordBreak: 'break-all', lineHeight: 1.4 }}>
                      {hero.desktop_url || <em style={{ color: '#9ca3af' }}>Not set</em>}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Smartphone size={13} style={{ color: '#6b7280', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#374151', wordBreak: 'break-all', lineHeight: 1.4 }}>
                      {hero.mobile_url || <em style={{ color: '#9ca3af' }}>Same as desktop</em>}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Note about applying changes */}
      <div style={{
        marginTop: '32px', background: '#f8fafc', border: '1px solid #e2e8f0',
        borderRadius: '10px', padding: '16px', fontSize: '13px', color: '#475569'
      }}>
        <strong>📌 How to apply changes to the live site:</strong>
        <ol style={{ marginTop: '8px', paddingLeft: '20px', lineHeight: 2 }}>
          <li>Upload your new image to the <code>/public/images/</code> folder.</li>
          <li>Enter the image path here (e.g. <code>/images/my-new-hero.jpg</code>) and click Save.</li>
          <li>If using DB persistence, changes apply immediately on next page load.</li>
          <li>Without DB, update the URL here and ask the AI to push the matching code change.</li>
        </ol>
      </div>
    </div>
  );
}
