'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="container section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h1>
        
        <div className="form-group mb-4">
          <label className="form-label text-xs">EMAIL ADDRESS</label>
          <input type="email" className="form-input" placeholder="Enter your email" />
        </div>
        
        <div className="form-group mb-6">
          <label className="form-label text-xs">PASSWORD</label>
          <input type="password" className="form-input" placeholder="Enter your password" />
        </div>
        
        <button className="btn btn--primary btn--full btn--lg mb-4" onClick={() => alert('Authentication system coming soon.')}>SIGN IN</button>
        
        <div className="text-center">
          <p className="text-sm text-secondary mb-2">Don't have an account?</p>
          <button className="btn btn--secondary btn--full" onClick={() => alert('Registration system coming soon.')}>CREATE AN ACCOUNT</button>
        </div>
      </div>
    </div>
  );
}
