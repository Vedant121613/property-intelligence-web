import React from 'react';
import { 
  X, 
  Home, 
  Tag, 
  ShoppingBag, 
  User, 
  Briefcase, 
  CreditCard, 
  Heart, 
  FileText, 
  Info, 
  LogOut,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileDrawer({ 
  isOpen, 
  onClose, 
  onNavigate, 
  onOpenAuth 
}) {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isOpen) return null;

  const handleItemClick = (action) => {
    onClose();
    if (action === 'home') onNavigate('home');
    else if (action === 'profile') onNavigate('profile');
    else if (action === 'buy') onNavigate('city', { cityId: 'pune' });
    else if (action === 'sell') onNavigate('home');
    else if (action === 'plans') onNavigate('plans');
    else if (action === 'favourites') onNavigate('profile');
    else if (action === 'viewed') onNavigate('profile');
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        justifyContent: 'flex-end',
        padding: 0,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 2500
      }}
    >
      <div 
        className="profile-slideover-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '320px',
          maxWidth: '85vw',
          height: '100vh',
          background: '#FFFFFF',
          boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header (Screenshot 4) */}
        <div 
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#1E293B',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              {isAuthenticated && user ? (user.avatar || 'PF') : <User size={20} />}
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>
                {isAuthenticated && user ? user.name : 'Pureframe User'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {isAuthenticated && user ? user.role : 'Guest Member'}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{ 
              color: '#64748B', 
              padding: '6px', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Item List (Screenshot 4) */}
        <div style={{ padding: '12px 0', flex: 1 }}>
          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('home')}
          >
            <Home size={18} color="#475569" />
            <span>Home</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('sell')}
          >
            <Tag size={18} color="#475569" />
            <span>Sell</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('buy')}
          >
            <ShoppingBag size={18} color="#475569" />
            <span>Buy</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('profile')}
          >
            <User size={18} color="#475569" />
            <span>Profile</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => { onClose(); onNavigate('admin'); }}
          >
            <ShieldCheck size={18} color="#7c3aed" />
            <span style={{ color: '#7c3aed', fontWeight: 700 }}>Admin Panel</span>
          </div>

          <div 
            className="drawer-nav-item"
            onClick={() => handleItemClick('profile')}
          >
            <Briefcase size={18} color="#475569" />
            <span>My Account &amp; Requests</span>
          </div>

          <div style={{ width: '100%', height: '1px', background: '#F1F5F9', margin: '8px 0' }} />

          <div 
            className="drawer-nav-item"
            onClick={() => { onClose(); logout(); }}
            style={{ color: '#ef4444' }}
          >
            <LogOut size={18} color="#ef4444" />
            <span style={{ color: '#ef4444', fontWeight: 700 }}>Log Out</span>
          </div>
        </div>

        {/* Bottom Drawer Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
          <button
            type="button"
            onClick={() => { onClose(); logout(); }}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
