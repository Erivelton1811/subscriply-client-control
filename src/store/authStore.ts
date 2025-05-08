
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, SystemSettings, User } from '@/types';

// Admin user credentials
const ADMIN_USER: User = {
  username: 'eriveltonadmin',
  password: 'epa1b2c3d4',
  isAdmin: true,
};

// Default system settings
const DEFAULT_SETTINGS: SystemSettings = {
  notificationEmail: 'admin@example.com',
  enableEmailNotifications: true,
  subscriptionWarningDays: 7,
  companyName: 'Subscriply',
  allowUserRegistration: false,
  theme: 'light',
};

interface AuthStore extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (username: string, password: string, isAdmin: boolean) => void;
  updateUser: (originalUsername: string, username: string, password?: string, isAdmin?: boolean) => void;
  deleteUser: (username: string) => void;
  getUsers: () => User[];
  // System settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [ADMIN_USER],
      settings: DEFAULT_SETTINGS,
      login: (username, password) => {
        // Get current users from store
        const users = get().users || [ADMIN_USER];
        
        // Find user with matching credentials
        const foundUser = users.find(
          (user) => user.username === username && user.password === password
        );
        
        if (foundUser) {
          set({
            user: foundUser,
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
      },
      addUser: (username, password, isAdmin) => {
        const newUser: User = {
          username,
          password,
          isAdmin,
        };
        
        set((state) => ({
          users: [...(state.users || [ADMIN_USER]), newUser],
        }));
      },
      updateUser: (originalUsername, username, password, isAdmin) => {
        set((state) => {
          const users = state.users || [ADMIN_USER];
          const updatedUsers = users.map((user) => {
            if (user.username === originalUsername) {
              return {
                ...user,
                username: username || user.username,
                password: password || user.password,
                isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin,
              };
            }
            return user;
          });
          
          // If the currently logged in user was updated, update the user state too
          if (state.user && state.user.username === originalUsername) {
            const updatedUser = updatedUsers.find(user => user.username === username);
            return {
              users: updatedUsers,
              user: updatedUser || state.user,
            };
          }
          
          return { users: updatedUsers };
        });
      },
      deleteUser: (username) => {
        set((state) => {
          // Don't allow deleting the admin user
          if (username === ADMIN_USER.username) {
            return state;
          }
          
          const users = state.users || [ADMIN_USER];
          return {
            users: users.filter((user) => user.username !== username),
          };
        });
      },
      getUsers: () => {
        const state = get();
        return state.users || [ADMIN_USER];
      },
      // System settings methods
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          }
        }));
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
