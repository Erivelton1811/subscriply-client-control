
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types';

// Admin user credentials
const ADMIN_USER: User = {
  username: 'eriveltonadmin',
  password: 'epa1b2c3d4',
  isAdmin: true,
};

interface AuthStore extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username, password) => {
        // Check if credentials match admin user
        if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
          set({
            user: ADMIN_USER,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
