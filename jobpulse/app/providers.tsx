'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  state?: string;
  city?: string;
  employment_status?: string;
  company_name?: string;
  job_role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, ask the server if we have a valid session cookie.
  // We never touch localStorage or document.cookie here — the HttpOnly
  // auth_token cookie is sent automatically by the browser on every request.
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          // Credentials: 'include' ensures cookies are sent cross-origin if needed.
          // For same-origin Next.js routes this is the default, but explicit is safer.
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
        // If 401, the cookie is absent/expired — user is simply not logged in.
      } catch {
        // Network error — stay unauthenticated
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // receive the Set-Cookie header
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'Login failed');
    }

    const data = await response.json();
    // The HttpOnly cookie is now set by the browser automatically.
    // We just store the user profile in React state.
    setUser(data.user);
  };

  const register = async (
    full_name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, phone, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'Registration failed');
    }

    return response.json();
  };

  const logout = async () => {
    // Ask the server to clear the HttpOnly cookie — client JS cannot do this itself.
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // cookie sent automatically
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error ?? 'Update failed');
    }

    const data = await response.json();
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}