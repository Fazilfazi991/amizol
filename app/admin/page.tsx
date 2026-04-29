'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Globe, LogOut, Package, Search, Save, AlertCircle } from 'lucide-react';
import InventoryManager from '@/components/admin/InventoryManager';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'orders' | 'inventory'>('orders');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    const logged = sessionStorage.getItem('littleDubaiAdmin') === 'true';
    if (logged) {
      setIsLoggedIn(true);
      fetchOrders();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      sessionStorage.setItem('littleDubaiAdmin', 'true');
      setIsLoggedIn(true);
      fetchOrders();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('littleDubaiAdmin');
    setIsLoggedIn(false);
  };

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      setStats({
        total: data?.length || 0,
        pending: data?.filter((o: any) => o.status === 'Pending').length || 0
      });
    } catch (e) {
      console.error("Error fetching orders:", e);
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchOrders();
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <h1 className="admin-login__logo">LITTLE DUBAI</h1>
          <p className="admin-login__subtitle">Admin Portal</p>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" className="btn btn--primary btn--full">ACCESS DASHBOARD</button>
            <p className="admin-login__hint">Hint: password is "admin123"</p>
            {error && <p className="admin-login__error">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2>LITTLE DUBAI</h2>
          <span className="badge">ADMIN</span>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav__item ${currentView === 'orders' ? 'active' : ''}`}
            onClick={() => setCurrentView('orders')}
          >
            <ShoppingBag size={18} /> Orders
          </button>
          <button 
            className={`admin-nav__item ${currentView === 'inventory' ? 'active' : ''}`}
            onClick={() => setCurrentView('inventory')}
          >
            <Package size={18} /> Inventory
          </button>
          <a href="/" className="admin-nav__item"><Globe size={18} /> View Website</a>
          <button className="admin-nav__item" onClick={handleLogout}><LogOut size={18} /> Logout</button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{currentView === 'orders' ? 'Order Management' : 'Inventory Management'}</h1>
          {currentView === 'orders' && (
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-card__title">Total Orders</div>
                <div className="stat-card__value">{stats.total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__title">Pending Action</div>
                <div className="stat-card__value">{stats.pending}</div>
              </div>
            </div>
          )}
        </header>

        <div className="admin-content">
          {currentView === 'orders' ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Items</th>
                    <th>Total (AED)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                      <td>
                        <strong>{order.customer_name}</strong>
                        <div className="customer-meta">{order.customer_address}</div>
                      </td>
                      <td><a href={`tel:${order.customer_phone}`}>{order.customer_phone}</a></td>
                      <td>
                        <ul className="order-items-list">
                          {order.order_items?.map((item: any, idx: number) => (
                            <li key={idx}>{item.name} ({item.size}) - {item.price}</li>
                          ))}
                        </ul>
                      </td>
                      <td><strong>AED {order.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {order.status === 'Pending' && (
                          <button className="btn btn--primary btn-small" onClick={() => updateStatus(order.id, 'Confirmed')}>Confirm</button>
                        )}
                        {order.status === 'Confirmed' && (
                          <button className="btn btn--secondary btn-small" style={{ borderColor: '#22c55e', color: '#22c55e' }} onClick={() => updateStatus(order.id, 'Delivered')}>Mark Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <InventoryManager />
          )}
        </div>
      </main>
    </div>
  );
}
