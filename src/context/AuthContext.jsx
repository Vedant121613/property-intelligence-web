import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const SINGLE_USER = {
  id: 'usr_single_user',
  name: 'Authorized User',
  email: 'user@123',
  phone: 'user@123',
  username: 'user@123',
  city: 'Pune',
  role: 'admin',
  avatar: 'AU',
  joinedDate: 'October 2026',
  verifiedBadge: true,
  is_payment_done: true,
  free_attempts_left: 999,
  free_attempts_used: 0,
  selected_plan: 'enterprise',
  unlocked_deeds: ['11089052']
};

export function AuthProvider({ children }) {
  // Citizen Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'user@123' || parsed.email === 'user@123') {
          return { ...SINGLE_USER, ...parsed };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const authSaved = localStorage.getItem('pureframe_authenticated');
      const userSaved = localStorage.getItem('pureframe_user');
      if (authSaved && userSaved) {
        const parsed = JSON.parse(userSaved);
        return (parsed.username === 'user@123' || parsed.email === 'user@123') && JSON.parse(authSaved) === true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Dedicated Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_admin_auth');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_admin_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username === 'user@123' || parsed.email === 'user@123') {
          return { ...SINGLE_USER, ...parsed };
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [unlockedDeeds, setUnlockedDeeds] = useState(() => {
    try {
      const saved = localStorage.getItem('pureframe_unlocked_deeds');
      return saved ? JSON.parse(saved) : ['11089052'];
    } catch {
      return ['11089052'];
    }
  });

  // Persist Citizen Auth
  useEffect(() => {
    try {
      if (user && isAuthenticated) {
        localStorage.setItem('pureframe_user', JSON.stringify(user));
        localStorage.setItem('pureframe_authenticated', 'true');
      } else {
        localStorage.removeItem('pureframe_user');
        localStorage.setItem('pureframe_authenticated', 'false');
      }
    } catch (e) {
      console.warn('Failed to persist auth:', e);
    }
  }, [user, isAuthenticated]);

  // Persist Admin Auth
  useEffect(() => {
    try {
      localStorage.setItem('pureframe_admin_auth', JSON.stringify(isAdminAuthenticated));
      if (adminUser) {
        localStorage.setItem('pureframe_admin_user', JSON.stringify(adminUser));
      } else {
        localStorage.removeItem('pureframe_admin_user');
      }
    } catch (e) {
      console.warn('Failed to persist admin auth:', e);
    }
  }, [isAdminAuthenticated, adminUser]);

  // Persist Unlocked Deeds
  useEffect(() => {
    try {
      localStorage.setItem('pureframe_unlocked_deeds', JSON.stringify(unlockedDeeds));
    } catch (e) {
      console.warn('Failed to persist unlocked deeds:', e);
    }
  }, [unlockedDeeds]);

  /**
   * Single User Login (user@123 / pass@123)
   */
  const login = async (identifier = '', password = '') => {
    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both username and password.' };
    }

    if (cleanId === 'user@123' && cleanPass === 'pass@123') {
      const authorizedAccount = { ...SINGLE_USER, unlocked_deeds: unlockedDeeds };

      // Optional background sync with backend /api/auth/login
      try {
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanId, password: cleanPass })
        }).catch(() => {});
      } catch {
        // Ignore network offline
      }

      setUser(authorizedAccount);
      setIsAuthenticated(true);
      setAdminUser(authorizedAccount);
      setIsAdminAuthenticated(true);
      return { success: true, user: authorizedAccount };
    }

    return { 
      success: false, 
      message: 'Access denied: Only the authorized user account (user@123) with pass@123 is allowed.' 
    };
  };

  /**
   * Logout
   */
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  /**
   * Admin Login - validates user@123 and pass@123
   */
  const adminLogin = (adminId = '', password = '') => {
    const cleanId = (adminId || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both Admin ID and Password.' };
    }

    if (cleanId === 'user@123' && cleanPass === 'pass@123') {
      const authorizedAccount = { ...SINGLE_USER, unlocked_deeds: unlockedDeeds };
      setAdminUser(authorizedAccount);
      setIsAdminAuthenticated(true);
      setUser(authorizedAccount);
      setIsAuthenticated(true);
      return { success: true, admin: authorizedAccount };
    }

    return { 
      success: false, 
      message: 'Access denied: Invalid credentials. Only user@123 is authorized.' 
    };
  };

  /**
   * Admin Logout
   */
  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
  };

  /**
   * Unlock deed for the single authorized user
   */
  const unlockTxn = async (transactionId) => {
    const txnStr = String(transactionId);
    if (!unlockedDeeds.includes(txnStr)) {
      const updated = [...unlockedDeeds, txnStr];
      setUnlockedDeeds(updated);
      try {
        await fetch('/api/user/unlock-deed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: 'user@123', transactionId: txnStr })
        });
      } catch {
        // Local state already updated
      }
    }
    return { success: true, unlocked: true };
  };

  const selectPlan = async (planId) => {
    return { success: true };
  };

  const resetAttempts = async () => {
    setUnlockedDeeds(['11089052']);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        // Admin Portal Auth
        adminUser,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        // Unlocked deeds & attempts
        freeAttemptsLeft: 999,
        freeAttemptsUsed: 0,
        isPaymentDone: true,
        selectedPlan: 'enterprise',
        unlockedDeeds,
        unlockTxn,
        selectPlan,
        resetAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
