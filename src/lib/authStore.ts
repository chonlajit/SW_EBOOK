import { User, UserRole } from './types';

// Pre-seeded accounts: default Admin and default User
export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-001',
    username: 'admin',
    email: 'admin@cjshop.com',
    name: 'CJ Administrator',
    role: 'admin',
    password: 'admin123',
    created_at: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'usr-customer-001',
    username: 'cjuser',
    email: 'user@cjshop.com',
    name: 'Customer Demo',
    role: 'user',
    password: 'user123',
    created_at: '2026-09-02T00:00:00.000Z',
  },
];

export const USERS_STORAGE_KEY = 'cjshop_users_v1';
export const CURRENT_USER_STORAGE_KEY = 'cjshop_current_user_v1';

/**
 * Get all users from localStorage or fallback to default seed users
 */
export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

/**
 * Save users to localStorage
 */
export function saveStoredUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage:', err);
  }
}

/**
 * Get currently logged-in user
 */
export function getStoredCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Set currently logged-in user
 */
export function setStoredCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user in localStorage:', err);
  }
}

/**
 * Email format validation helper
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Username format validation helper (alphanumeric and underscore, min 3 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,24}$/;
  return usernameRegex.test(username.trim());
}
