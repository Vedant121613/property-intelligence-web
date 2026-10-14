import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ChevronDown, 
  Heart, 
  User, 
  ArrowRight, 
  X, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Wallet,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink
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
  const { user, isAuthenticated, isAdmin, logout, switchRole } = useAuth();
  const { walletBalance, requests } = useRequests();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Requests badge count
  const userRequests = requests.filter(r => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'admin');
  const sharedCount = userRequests.filter(r => r.status === 'shared').length;
  const pendingCount = userRequests.filter(r => r.status === 'pending').length;

  return (
    <>
      <header className="navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="content-wrapper navbar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          
          {/* Brand Logo */}
          <div 
            className="navbar-brand" 
            onClick={() => onNavigate('home', {})}
            role="button"
            tabIndex={0}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div className="brand-icon-box" style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              <Building2 size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-name" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Pure<span style={{ color: '#2563eb' }}>frame</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-3px' }}>
                Pune Deed Intelligence
              </span>
            </div>
          </div>

          {/* Center Location Indicator (Strictly Pune) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '6px 14px',
            borderRadius: '999px'
          }}>
            <MapPin size={15} color="#2563eb" />
            <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a' }}>
              Pune District
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              background: '#dcfce7',
              color: '#15803d',
              padding: '2px 7px',
              borderRadius: '999px',
              border: '1px solid #86efac'
            }}>
              11,078 Projects • 15 Talukas
            </span>
          </div>

          {/* Right Navigation Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Featured Projects Link Button */}
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
              title="Explore Curated Pune Projects"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FAF7F2',
                border: '1px solid #E5E0D8',
                color: '#1A1A1A',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F4EFE6';
                e.currentTarget.style.borderColor = '#C59B27';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF7F2';
                e.currentTarget.style.borderColor = '#E5E0D8';
              }}
            >
              <Sparkles size={14} color="#C59B27" />
              <span>Projects</span>
            </button>

            {/* Wallet Button */}
            <button
              type="button"
              onClick={() => setShowWalletModal(true)}
              title="Manage Wallet Balance & History"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Wallet size={15} color="#16a34a" />
              <span>Wallet:</span>
              <span style={{ color: '#15803d', fontWeight: 800 }}>
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Request Completion Page Button */}
            <button
              type="button"
              onClick={() => onNavigate('completion')}
              title="View your requested Registered Deeds & Index 2 documents with uploaded PDFs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: currentPage === 'completion' ? '#2563eb' : (sharedCount > 0 ? '#eff6ff' : '#f8fafc'),
                border: `1px solid ${currentPage === 'completion' ? '#2563eb' : (sharedCount > 0 ? '#bfdbfe' : '#e2e8f0')}`,
                color: currentPage === 'completion' ? '#ffffff' : (sharedCount > 0 ? '#1d4ed8' : '#334155'),
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <FileText size={15} />
              <span>Request Completion</span>
              {userRequests.length > 0 && (
                <span style={{
                  background: currentPage === 'completion' ? 'rgba(255,255,255,0.25)' : (sharedCount > 0 ? '#16a34a' : '#ea580c'),
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '999px'
                }}>
                  {userRequests.length}
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: currentPage === 'admin' ? '#7c3aed' : '#faf5ff',
                border: `1px solid ${currentPage === 'admin' ? '#7c3aed' : '#d8b4fe'}`,
                color: currentPage === 'admin' ? '#ffffff' : '#6b21a8',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Open MahaRERA Admin Request Management Panel"
            >
              <ShieldCheck size={15} />
              <span>Admin Panel</span>
            </button>

            {/* User Profile / Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f1f5f9',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#334155'
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  {user?.avatar || 'PB'}
                </div>
                <span>{user?.name ? user.name.split(' ')[0] : 'Citizen'}</span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Log out to Dummy Login Page"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px'
                }}
              >
                <LogOut size={16} />
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
