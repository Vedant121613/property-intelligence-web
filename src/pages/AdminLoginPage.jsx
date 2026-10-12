import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage({ onNavigate, onLoginSuccess }) {
  const { adminLogin } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      setErrorMsg('Please enter both Admin ID and Password.');
      return;
    }
    setErrorMsg('');

    const res = adminLogin(adminId.trim(), password.trim());
    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onNavigate) {
        onNavigate('admin');
      }
    } else {
      setErrorMsg(res.message || 'Invalid credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '24px 16px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.08)'
      }}>
        {/* Simple Brand / Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            marginBottom: '14px'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 6px 0'
          }}>
            Admin Login
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0
          }}>
            Enter your credentials to access the admin portal
          </p>
        </div>

        {/* Quick Fill Helper */}
        <div style={{
          marginBottom: '16px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#1e40af'
        }}>
          <div>
            Authorized: <strong>user@123</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setAdminId('user@123');
              setPassword('pass@123');
              setErrorMsg('');
            }}
            style={{
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '0.725rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px'
            }}>
              Admin ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="user@123"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="pass@123"
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          {errorMsg && (
            <div style={{
              padding: '10px 12px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#b91c1c',
              fontSize: '0.825rem'
            }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '4px',
              padding: '11px',
              borderRadius: '8px',
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              fontSize: '0.925rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          >
            <span>Sign In</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Back Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.825rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Website</span>
          </button>
        </div>
      </div>
    </div>
  );
}
