
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
> = (set) => ({
  resetToInitialData: () => {
    const currentUser = useAuthStore.getState().user;
    const username = currentUser ? currentUser.username : 'default';
    
    // Adicionar userId aos clientes iniciais
    const customersWithUserId = initialCustomers.map(customer => ({
      ...customer,
      userId: username
    }));
    
    set({
      plans: initialPlans,
      customers: customersWithUserId,
    });
    toast.success("Dados redefinidos para o padrão inicial");
  },
});
