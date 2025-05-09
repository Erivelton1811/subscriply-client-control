
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, SystemSettings, User } from '@/types';
import { toast } from 'sonner';

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
  deleteUser: (username: string) => boolean; // Alterado para retornar boolean para indicar sucesso/falha
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
          
          // Se o usuário logado foi atualizado, atualize também o estado do usuário
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
        // Não permitir exclusão do usuário admin principal
        if (username === ADMIN_USER.username) {
          toast.error("Não é permitido excluir o administrador principal do sistema.");
          return false;
        }
        
        const currentState = get();
        const users = currentState.users || [ADMIN_USER];
        
        // Verificar se o usuário a ser excluído existe
        if (!users.some(user => user.username === username)) {
          toast.error("Usuário não encontrado.");
          return false;
        }
        
        // Filtrar o usuário a ser excluído
        const updatedUsers = users.filter((user) => user.username !== username);
        
        // Atualizar o estado
        set({ users: updatedUsers });
        toast.success("Usuário excluído com sucesso.");
        return true;
      },
      getUsers: () => {
        const state = get();
        return state.users || [ADMIN_USER];
      },
      // Métodos de configurações do sistema
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
