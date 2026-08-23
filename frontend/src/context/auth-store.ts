import { createContext, useContext } from 'react';

export interface AuthUser {
  token: string;
  role: string;
  userId: string;
  employeeId: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (token: string, role: string, userId: string, employeeId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
