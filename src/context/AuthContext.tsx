'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredUsers,
  saveStoredUsers,
  DEFAULT_USERS,
} from '@/lib/authStore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLoginAs: (role: UserRole) => Promise<void>;
  promoteUser: (targetUsernameOrEmail: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  allUsers: User[];
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load current user and fetch latest users list (including script changes)
  const refreshUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users && Array.isArray(data.users)) {
          setAllUsers(data.users);
          saveStoredUsers(data.users);

          // If current user is logged in, sync their latest role from server/script
          const curr = getStoredCurrentUser();
          if (curr) {
            const fresh = data.users.find(
              (u: User) =>
                u.id === curr.id ||
                u.username.toLowerCase() === curr.username.toLowerCase()
            );
            if (fresh) {
              const updated = { ...curr, role: fresh.role, name: fresh.name, email: fresh.email };
              setUser(updated);
              setStoredCurrentUser(updated);
              return;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch /api/auth/users, using localStorage fallback');
    }

    // Fallback to localStorage
    const localUsers = getStoredUsers();
    setAllUsers(localUsers);
    const curr = getStoredCurrentUser();
    setUser(curr);
  };

  useEffect(() => {
    const init = async () => {
      const curr = getStoredCurrentUser();
      setUser(curr);
      await refreshUsers();
      setLoading(false);
    };
    init();
  }, []);

  const login = async (identifier: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' };
      }

      setUser(data.user);
      setStoredCurrentUser(data.user);
      await refreshUsers();
      return { success: true };
    } catch (err: any) {
      // Local fallback
      const localUsers = getStoredUsers();
      const q = identifier.trim().toLowerCase();
      const matched = localUsers.find(
        (u) => (u.username.toLowerCase() === q || u.email.toLowerCase() === q) && u.password === pass
      );
      if (matched) {
        const { password: _, ...safe } = matched;
        setUser(safe as User);
        setStoredCurrentUser(safe as User);
        return { success: true };
      }
      return { success: false, error: err?.message || 'การเชื่อมต่อขัดข้อง' };
    }
  };

  const register = async (formData: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'สมัครสมาชิกไม่สำเร็จ' };
      }

      // Automatically log the new user in
      setUser(data.user);
      setStoredCurrentUser(data.user);
      await refreshUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'การเชื่อมต่อขัดข้อง' };
    }
  };

  const logout = () => {
    setUser(null);
    setStoredCurrentUser(null);
  };

  // Quick one-click switch for test demos
  const quickLoginAs = async (role: UserRole) => {
    if (role === 'admin') {
      await login('admin', 'admin123');
    } else {
      await login('cjuser', 'user123');
    }
  };

  const promoteUser = async (targetUsernameOrEmail: string, newRole: UserRole) => {
    if (user?.role !== 'admin') {
      return { success: false, error: 'ต้องเป็น Admin เท่านั้น' };
    }
    try {
      const res = await fetch('/api/auth/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUsernameOrEmail,
          newRole,
          requesterRole: user.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'ไม่สามารถเปลี่ยน Role ได้' };
      }
      await refreshUsers();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'เกิดข้อผิดพลาด' };
    }
  };

  // Admin system disabled per user request; login system remains fully functional
  const isAdmin = false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        quickLoginAs,
        promoteUser,
        allUsers,
        refreshUsers,
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
