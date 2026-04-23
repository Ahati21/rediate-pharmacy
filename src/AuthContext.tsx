import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './types';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  userName: string;
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const login = (newRole: UserRole, name?: string) => {
    setRole(newRole);
    if (name) setUserName(name);
    else {
      // Default names based on role if no name provided
      setUserName(newRole === 'admin' ? 'Dr. Julian Vance' : newRole === 'pharmacist' ? 'Pharmacist' : 'Abebe Bikila');
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ role, setRole, isLoggedIn, userName, login, logout }}>
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
