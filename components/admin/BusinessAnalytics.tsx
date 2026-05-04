'use client';

import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: string;
  customer_name: string;
  customer_email?: string;
  payment_method?: string;
}

interface Props {
  orders: Order[];
}

export default function BusinessAnalytics({ orders }: Props) {
  const [filter, setFilter] = useState<'today' | 'weekly' | 'monthly' | 'all'>('all');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(order => {
      if (filter === 'all') return true;
      
      const orderDate = new Date(order.created_at);
      const diffTime = Math.abs(now.getTime() - orderDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filter === 'today') return diffDays <= 1;
      if (filter === 'weekly') return diffDays <= 7;
      if (filter === 'monthly') return diffDays <= 30;
      return true;
    });
  }, [orders, filter]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue,
      totalOrders,
      avgOrderValue
    };
  }, [filteredOrders]);

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Payment Method', 'Status', 'Total (AED)'];
    
    const rows = filteredOrders.map(order => [
      order.id,
      new Date(order.created_at).toLocaleString(),
      `"${order.customer_name || ''}"`,
      order.customer_email || 'N/A',
      order.payment_method || 'cod',
      order.status,
      order.total_price
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `business_export_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-container" style={{ padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Business Overview</h2>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none' }}
          >
            <option value="today">Today</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          
          <button 
            onClick={exportToCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#000', color: '#fff', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '24px', background: '#f5f5f5', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#666' }}>
            <TrendingUp size={20} />
            <h3 style={{ fontSize: '14px', margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>Total Revenue</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>AED {metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div style={{ padding: '24px', background: '#f5f5f5', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#666' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '14px', margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>Total Orders</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{metrics.totalOrders}</div>
        </div>

        <div style={{ padding: '24px', background: '#f5f5f5', borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: '#666' }}>
            <CreditCard size={20} />
            <h3 style={{ fontSize: '14px', margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>Avg Order Value</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>AED {metrics.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>Recent Transactions ({filter})</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>Date</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>Order ID</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>Customer</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>Status</th>
              <th style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? filteredOrders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'monospace' }}>{order.id.substring(0, 8)}...</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{order.customer_name}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, background: order.status === 'Pending' ? '#fff7ed' : '#e6f7ed', color: order.status === 'Pending' ? '#c2410c' : '#15803d' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>AED {Number(order.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#999' }}>No transactions found for this period.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
