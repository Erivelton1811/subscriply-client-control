
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
    
    // Verificar se já existem dados no state atual
    const currentPlans = get().plans.filter(p => p.userId === username);
    const currentCustomers = get().customers.filter(c => c.userId === username);
    
    // Se já existem dados, não resetar
    if (currentPlans.length > 0 || currentCustomers.length > 0) {
      toast.info("Dados existentes mantidos para este usuário");
      return;
    }
    
    // Só adiciona dados iniciais se não houver dados existentes para este usuário
    // Adicionar userId aos planos e clientes iniciais
    const plansWithUserId = initialPlans.map(plan => ({
      ...plan,
      userId: username
    }));
    
    const customersWithUserId = initialCustomers.map(customer => ({
      ...customer,
      userId: username
    }));
    
    // Manter planos e clientes de outros usuários e adicionar os novos
    set((state) => ({
      plans: [
        ...state.plans.filter(p => p.userId !== username), 
        ...plansWithUserId
      ],
      customers: [
        ...state.customers.filter(c => c.userId !== username),
        ...customersWithUserId
      ],
    }));
    
    toast.success("Dados iniciais carregados");
  },
});
