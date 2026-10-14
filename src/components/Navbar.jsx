import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Wallet,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import WalletModal from './WalletModal';
import MyRequestsModal from './MyRequestsModal';
import ProfileDrawer from './ProfileDrawer';

export default function Navbar({ 
  currentCity = 'pune', 
  onSelectCity, 
  onNavigate,
  currentPage = 'home'
}) {
  const { user, logout } = useAuth();
  const { walletBalance, requests } = useRequests();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Requests count
  const userRequests = requests.filter(r => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'admin');
  const sharedCount = userRequests.filter(r => r.status === 'shared').length;

  // Active tab determination
  const isDeedSearchActive = currentPage === 'home' || currentPage === 'city' || currentPage === 'locality' || currentPage === 'project' || currentPage === 'continue';
  const isFeaturedActive = currentPage === 'featured-project';
  const isCompletionActive = currentPage === 'completion' || currentPage === 'requests';
  const isAdminActive = currentPage === 'admin';

  return (
    <>
      <header className="navbar" style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          
          {/* Left Brand & Region Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            {/* Logo */}
            <div 
              onClick={() => onNavigate('home', {})}
              role="button"
              tabIndex={0}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
              }}>
                <Building2 size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Pure<span style={{ color: '#2563EB' }}>frame</span>
                </span>
                <span style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>
                  Pune Deed Intelligence
                </span>
              </div>
            </div>

            {/* Subtle Location Chip */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontWeight: 700, color: '#0F172A' }}>Pune</span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ color: '#64748B', fontSize: '0.74rem' }}>11,078 Projects</span>
            </div>
          </div>

          {/* Center: Clean Segmented Navigation Tabs */}
          <nav 
            aria-label="Main Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px',
              border: '1px solid #E2E8F0'
            }}
          >
            {/* Tab 1: Deed Search */}
            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: isDeedSearchActive ? 700 : 600,
                color: isDeedSearchActive ? '#0F172A' : '#64748B',
                background: isDeedSearchActive ? '#FFFFFF' : 'transparent',
                border: isDeedSearchActive ? '1px solid #E2E8F0' : '1px solid transparent',
                boxShadow: isDeedSearchActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isDeedSearchActive) {
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeedSearchActive) {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Search size={15} color={isDeedSearchActive ? '#2563EB' : '#64748B'} />
              <span>Deed Search</span>
            </button>

            {/* Tab 2: Featured Projects */}
            <button
              type="button"
              onClick={() => {
                if (currentPage !== 'home') {
                  onNavigate('home');
                }
                setTimeout(() => {
                  const el = document.getElementById('featured-projects-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: isFeaturedActive ? 700 : 600,
                color: isFeaturedActive ? '#0F172A' : '#64748B',
                background: isFeaturedActive ? '#FFFFFF' : 'transparent',
                border: isFeaturedActive ? '1px solid #E2E8F0' : '1px solid transparent',
                boxShadow: isFeaturedActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isFeaturedActive) {
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isFeaturedActive) {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Sparkles size={15} color={isFeaturedActive ? '#D97706' : '#64748B'} />
              <span>Featured Projects</span>
            </button>

            {/* Tab 3: Request Completion */}
            <button
              type="button"
              onClick={() => onNavigate('completion')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: isCompletionActive ? 700 : 600,
                color: isCompletionActive ? '#0F172A' : '#64748B',
                background: isCompletionActive ? '#FFFFFF' : 'transparent',
                border: isCompletionActive ? '1px solid #E2E8F0' : '1px solid transparent',
                boxShadow: isCompletionActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isCompletionActive) {
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCompletionActive) {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <FileText size={15} color={isCompletionActive ? '#2563EB' : '#64748B'} />
              <span>Request Completion</span>
              {userRequests.length > 0 && (
                <span style={{
                  background: isCompletionActive ? '#2563EB' : (sharedCount > 0 ? '#16A34A' : '#EA580C'),
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '999px',
                  lineHeight: 1.3
                }}>
                  {userRequests.length}
                </span>
              )}
            </button>

            {/* Tab 4: Admin Panel */}
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: isAdminActive ? 700 : 600,
                color: isAdminActive ? '#0F172A' : '#64748B',
                background: isAdminActive ? '#FFFFFF' : 'transparent',
                border: isAdminActive ? '1px solid #E2E8F0' : '1px solid transparent',
                boxShadow: isAdminActive ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isAdminActive) {
                  e.currentTarget.style.color = '#0F172A';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAdminActive) {
                  e.currentTarget.style.color = '#64748B';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <ShieldCheck size={15} color={isAdminActive ? '#7C3AED' : '#64748B'} />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Right Utilities & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Wallet Pill Button */}
            <button
              type="button"
              onClick={() => setShowWalletModal(true)}
              title="Manage Wallet Balance & Top Up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#166534',
                padding: '7px 13px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#DCFCE7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#F0FDF4'}
            >
              <Wallet size={15} color="#16A34A" />
              <span>₹{walletBalance.toLocaleString('en-IN')}</span>
            </button>

            {/* Profile & Logout Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '4px 6px 4px 10px',
              gap: '8px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {user?.avatar || 'AU'}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                {user?.name ? user.name.split(' ')[0] : 'Authorized'}
              </span>
              <div style={{ width: '1px', height: '16px', background: '#E2E8F0', margin: '0 2px' }} />
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Wallet Management Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      {/* Citizen Document Requests Modal */}
      <MyRequestsModal
        isOpen={showRequestsModal}
        onClose={() => setShowRequestsModal(false)}
        onNavigate={onNavigate}
      />

      {/* Profile Slide-Over Drawer */}
      <ProfileDrawer
        isOpen={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
