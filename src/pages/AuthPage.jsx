import React, { useState } from 'react';
import { Building2, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ onNavigate, onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both Username and Password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(username.trim(), password.trim());
      if (res.success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        } else if (onNavigate) {
          onNavigate('home');
        }
      } else {
        setErrorMsg(res.message || 'Access denied: Invalid credentials.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
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
        {/* Brand / Icon */}
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
            <Building2 size={26} />
          </div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 6px 0'
          }}>
            User Login
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: 0
          }}>
            Enter your credentials to access the portal
          </p>
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
              Username / ID
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
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
                placeholder="Enter Password"
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
            disabled={isLoading}
            style={{
              marginTop: '4px',
              padding: '11px',
              borderRadius: '8px',
              backgroundColor: '#1d4ed8',
              color: '#ffffff',
              fontSize: '0.925rem',
              fontWeight: 600,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: isLoading ? 0.8 : 1,
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#1e40af';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Link to Admin Portal */}
        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
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
            onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
          >
            <ShieldCheck size={14} />
            <span>Admin Portal Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
