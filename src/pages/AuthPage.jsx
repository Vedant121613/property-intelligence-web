import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  MapPin,
  CheckCircle2,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ onNavigate, onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }
    setErrorMsg('');
    const res = await login(username.trim(), password.trim());
    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (onNavigate) {
        onNavigate('home');
      }
    } else {
      setErrorMsg(res.message || 'Access denied: Only user@123 is authorized.');
    }
  };

  const handleQuickFill = () => {
    setUsername('user@123');
    setPassword('pass@123');
    setErrorMsg('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d16 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(30, 41, 59, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.5)',
            marginBottom: '16px'
          }}>
            <Building2 size={32} color="#ffffff" />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            color: '#60a5fa',
            fontWeight: 700,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <MapPin size={12} />
            <span>PUNE DISTRICT PROPERTY REPOSITORY</span>
          </div>

          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: '0 0 6px',
            color: '#ffffff'
          }}>
            Authorized Sign-In
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: 0
          }}>
            Single-User Protected Access
          </p>
        </div>

        {/* Quick Fill Helper */}
        <div style={{
          marginBottom: '16px',
          background: 'rgba(37, 99, 235, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#bfdbfe'
        }}>
          <div>
            Authorized Account: <strong style={{ color: '#ffffff' }}>user@123</strong>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Fill Credentials
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#cbd5e1',
              marginBottom: '6px'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@123"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#cbd5e1',
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
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '6px',
              padding: '13px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)'
            }}
          >
            <span>Sign In to Pune Portal</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* Separate Admin Portal Link */}
        <div style={{
          marginTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '18px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
            Are you an authorized MahaRERA / IGR Admin Officer?
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            style={{
              background: 'rgba(124, 58, 237, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#d8b4fe',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} />
            <span>Go to Admin Portal Login Gate →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
