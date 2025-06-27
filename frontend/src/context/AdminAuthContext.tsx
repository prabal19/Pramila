'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AdminAuthContextType {
  isAdmin: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_AUTH_KEY = 'pramila-admin-auth';

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem(ADMIN_AUTH_KEY);
      if (storedAuth === 'true') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Failed to read admin auth from sessionStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin && pathname.startsWith('/admin') && pathname !== '/admin') {
      router.push('/admin');
    }
  }, [isAdmin, loading, pathname, router]);

  const login = useCallback(() => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } catch (error) {
      console.error("Failed to save admin auth to sessionStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      router.push('/admin');
    } catch (error) {
      console.error("Failed to remove admin auth from sessionStorage", error);
    }
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
