import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import PuneHierarchyPage from './pages/PuneHierarchyPage';
import ProjectPage from './pages/ProjectPage';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import ContinueRequestPage from './pages/ContinueRequestPage';
import RequestCompletionPage from './pages/RequestCompletionPage';

function AppContent() {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      return { page: 'admin', params: {} };
    } else if (path.startsWith('/profile')) {
      return { page: 'profile', params: {} };
    } else if (path.startsWith('/details/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'details',
        params: { transactionId: parts[1] || '11089052' }
      };
    } else if (path.startsWith('/transactions')) {
      return {
        page: 'transactions',
        params: { projectId: 'heera-solitaire', cityId: 'pune' }
      };
    } else if (path.startsWith('/completion') || path.startsWith('/requests')) {
      return { page: 'completion', params: {} };
    } else if (path.startsWith('/continue')) {
      return { page: 'continue', params: {} };
    } else if (path.startsWith('/project/')) {
      const parts = path.split('/').filter(Boolean);
      return {
        page: 'project',
        params: {
          cityId: 'pune',
          localityId: parts[2] || 'baner',
          projectId: parts[3] || 'govind-vilas'
        }
      };
    }
    // Default to Pune Hierarchy home
    return {
      page: 'home',
      params: {}
    };
  });

  const navigateTo = (page, params = {}) => {
    setRoute({ page, params });

    let targetUrl = '/';
    if (page === 'home') {
      targetUrl = '/';
    } else if (page === 'admin') {
      targetUrl = '/admin';
    } else if (page === 'profile') {
      targetUrl = '/profile';
    } else if (page === 'completion') {
      targetUrl = '/completion';
    } else if (page === 'continue') {
      targetUrl = '/continue';
    } else if (page === 'transactions') {
      targetUrl = `/transactions?project=${params.projectId || 'govind-vilas'}`;
    } else if (page === 'details') {
      targetUrl = `/details/${params.transactionId || '11089052'}`;
    } else if (page === 'project') {
      targetUrl = `/project/pune/${params.localityId || 'baner'}/${params.projectId || 'govind-vilas'}`;
    }

    try {
      window.history.pushState({ page, params }, '', targetUrl);
    } catch {
      // Fallback for sandboxed environments
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setRoute(event.state);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. DEDICATED ADMIN ROUTE (Completely separate with Admin Login gate asking for Admin ID and Password)
  if (route.page === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onNavigate={navigateTo}
          onLoginSuccess={() => navigateTo('admin')}
        />
      );
    }
    return (
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main className="main-content" style={{ flex: 1 }}>
          <AdminPanel onNavigate={navigateTo} />
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  // 2. CITIZEN ROUTE: If citizen is not logged in, render the clean dummy login page
  if (!isAuthenticated) {
    return (
      <AuthPage 
        onNavigate={navigateTo}
        onLoginSuccess={() => navigateTo('home')}
      />
    );
  }

  // 3. CITIZEN AUTHENTICATED VIEW
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Persistent Navbar with Pune Only, Wallet pill, Requests badge, Admin Panel button */}
      <Navbar
        currentCity="pune"
        currentPage={route.page}
        onNavigate={navigateTo}
      />

      {/* Main Page Content */}
      <main className="main-content" style={{ flex: 1 }}>
        {route.page === 'home' && (
          <PuneHierarchyPage onNavigate={navigateTo} />
        )}

        {route.page === 'city' && (
          <PuneHierarchyPage onNavigate={navigateTo} />
        )}

        {route.page === 'locality' && (
          <PuneHierarchyPage onNavigate={navigateTo} />
        )}

        {route.page === 'project' && (
          <ProjectPage
            cityId="pune"
            localityId={route.params.localityId || 'baner'}
            projectId={route.params.projectId || 'govind-vilas'}
            talukaId={route.params.talukaId}
            villageName={route.params.villageName}
            talukaName={route.params.talukaName}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'profile' && (
          <ProfilePage onNavigate={navigateTo} />
        )}

        {route.page === 'transactions' && (
          <TransactionsPage
            projectId={route.params.projectId || 'govind-vilas'}
            cityId="pune"
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'details' && (
          <TransactionDetailPage
            transactionId={route.params.transactionId || '11089052'}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'continue' && (
          <ContinueRequestPage
            district={route.params.district || 'Pune'}
            taluka={route.params.taluka || 'Haveli'}
            talukaSlug={route.params.talukaSlug || 'haveli'}
            village={route.params.village || 'Baner'}
            villageSlug={route.params.villageSlug || 'baner'}
            initialProject={route.params.initialProject}
            onNavigate={navigateTo}
          />
        )}

        {route.page === 'completion' && (
          <RequestCompletionPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Floating Chat Assistant */}
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RequestProvider>
        <AppContent />
      </RequestProvider>
    </AuthProvider>
  );
}
