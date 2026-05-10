import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, ApiItemResponse } from './lib/api';
import { AuthUser, UserRole } from './types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  userName: string;
  user: AuthUser | null;
  isAuthLoading: boolean;
  login: (payload: { email: string; password: string; role: UserRole }) => Promise<AuthUser>;
  register: (payload: { name: string; email: string; phone: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const savedUser = localStorage.getItem('rediate_auth_user');

      if (!savedUser) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        setUser(parsedUser);
        setRole(parsedUser.role);
        setUserName(parsedUser.name);
        setIsLoggedIn(true);

        const response = await api.get<ApiItemResponse<AuthUser>>('/auth/me');
        const currentUser = response.data;
        setUser(currentUser);
        setRole(currentUser.role);
        setUserName(currentUser.name);
        localStorage.setItem('rediate_auth_user', JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem('rediate_auth_user');
        setIsLoggedIn(false);
        setUser(null);
        setRole('customer');
        setUserName('');
      } finally {
        setIsAuthLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const login = async ({ email, password, role: requestedRole }: { email: string; password: string; role: UserRole }) => {
    const response = await api.post<ApiItemResponse<AuthUser>>('/auth/login', {
      email,
      password,
      role: requestedRole,
    });

    const loggedInUser = response.data;
    setUser(loggedInUser);
    setRole(loggedInUser.role);
    setUserName(loggedInUser.name);
    setIsLoggedIn(true);
    localStorage.setItem('rediate_auth_user', JSON.stringify(loggedInUser));

    return loggedInUser;
  };

  const register = async ({ name, email, phone, password }: { name: string; email: string; phone: string; password: string }) => {
    const response = await api.post<ApiItemResponse<AuthUser>>('/auth/register', {
      name,
      email,
      phone,
      password,
      role: 'customer',
    });

    const registeredUser = response.data;
    setUser(registeredUser);
    setRole(registeredUser.role);
    setUserName(registeredUser.name);
    setIsLoggedIn(true);
    localStorage.setItem('rediate_auth_user', JSON.stringify(registeredUser));

    return registeredUser;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUser(null);
    setRole('customer');
    localStorage.removeItem('rediate_auth_user');
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isLoggedIn, userName, user, isAuthLoading, login, register, logout }}>
      {children}
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
