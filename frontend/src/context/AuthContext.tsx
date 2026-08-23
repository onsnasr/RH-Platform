import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './auth-store';
import type { AuthUser } from './auth-store';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    const employeeId = localStorage.getItem('employeeId') ?? '';
    if (token && role && userId) return { token, role, userId, employeeId };
    return null;
  });

  const login = (token: string, role: string, userId: string, employeeId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('employeeId', employeeId ?? '');
    setUser({ token, role, userId, employeeId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('employeeId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
