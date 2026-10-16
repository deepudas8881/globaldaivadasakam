import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  adminUsername: string | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithCredentials: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminUsername: null,
  loading: true,
  isAdmin: false,
  loginWithCredentials: async () => ({ success: false }),
  logout: async () => {}
});

const ADMIN_STORAGE_KEY = 'snf_global_admin_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local session for admin login
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY) || sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedAdmin) {
      setAdminUsername(storedAdmin);
      setIsAdmin(true);
    }

    // Also listen to Firebase auth state if available
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const email = currentUser.email?.toLowerCase();
          if (email === 'admin@example.com' || email?.includes('admin')) {
            setIsAdmin(true);
            setAdminUsername(currentUser.email || 'Admin');
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const loginWithCredentials = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check primary requested credentials: globaladmin / adminpanel
    if (
      (cleanUser === 'globaladmin' || cleanUser === 'admin' || cleanUser === 'admin@example.com') &&
      cleanPass === 'adminpanel'
    ) {
      setIsAdmin(true);
      setAdminUsername('globaladmin');
      localStorage.setItem(ADMIN_STORAGE_KEY, 'globaladmin');
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'globaladmin');
      return { success: true };
    }

    // Also attempt Firebase Auth if a standard email is entered
    if (cleanUser.includes('@')) {
      try {
        const cred = await signInWithEmailAndPassword(auth, username.trim(), pass);
        setUser(cred.user);
        setIsAdmin(true);
        setAdminUsername(cred.user.email || 'Admin');
        localStorage.setItem(ADMIN_STORAGE_KEY, cred.user.email || 'Admin');
        return { success: true };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Invalid credentials';
        return { success: false, error: `Login failed: ${errorMsg}` };
      }
    }

    return {
      success: false,
      error: 'Invalid username or password. Please use username: globaladmin and password: adminpanel'
    };
  };

  const logout = async () => {
    setIsAdmin(false);
    setAdminUsername(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminUsername, loading, isAdmin, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
