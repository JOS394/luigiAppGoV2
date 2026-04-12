"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { Usuario } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = apiService.auth.getCurrentUser();
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (savedUser && token) {
          setUser(savedUser);
        } else if (pathname !== '/login') {
          router.push('/login');
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]); // Dependencias estables

  const login = async (credentials: any) => {
    const data = await apiService.auth.login(credentials);
    setUser(data.usuario);
    router.push('/');
  };

  const logout = () => {
    apiService.auth.logout();
    setUser(null);
  };

  const isAdmin = user?.rol === 'administrador';

  // Si estamos en login, no bloqueamos el renderizado
  const isLoginPage = pathname === '/login';
  const shouldShowContent = !isLoading || isLoginPage;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, isAdmin }}>
      {shouldShowContent ? children : (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
          <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
          <p className="mt-6 font-black text-primary uppercase tracking-[0.3em] animate-pulse">Sincronizando Luigi-ID...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
