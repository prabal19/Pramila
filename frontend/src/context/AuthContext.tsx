
'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_USER_KEY = 'pramila-auth-user';
const SEEN_STATUS_KEY = 'pramila-seen-statuses';


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(AUTH_USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    const userKey = user ? `${SEEN_STATUS_KEY}-${user._id}` : null;
    setUser(null);
    try {
      localStorage.removeItem(AUTH_USER_KEY);
      if (userKey) {
          localStorage.removeItem(userKey);
      }
    } catch (error) {
      console.error("Failed to remove user data from localStorage", error);
    }
  }, [user]);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to update user in localStorage", error);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
