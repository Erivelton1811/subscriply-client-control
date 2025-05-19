
import { StateCreator } from 'zustand';
import { SubscriptionState, SystemSlice } from '../types';
import { plans as initialPlans, customers as initialCustomers } from '@/data/mockData';
import { toast } from "sonner";
import { useAuthStore } from '../authStore';

export const createSystemSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  SystemSlice
> = (set, get) => ({
  resetToInitialData: () => {
    const currentUser = useAuthStore.getState().user;
    const username = currentUser ? currentUser.username : 'default';
    
    // Limpar completamente os dados do usuário atual
    set((state) => ({
      plans: state.plans.filter(p => p.userId !== username),
      customers: state.customers.filter(c => c.userId !== username),
    }));
    
    // Adicionar dados iniciais com userId
    const plansWithUserId = initialPlans.map(plan => ({
      ...plan,
      userId: username
    }));
    
    const customersWithUserId = initialCustomers.map(customer => ({
      ...customer,
      userId: username
    }));
    
    // Adicionar os novos planos e clientes com o userId atual
    set((state) => ({
      plans: [...state.plans, ...plansWithUserId],
      customers: [...state.customers, ...customersWithUserId],
    }));
    
    toast.success("Dados resetados com sucesso. Sistema iniciado com dados padrão.");
  },
});
