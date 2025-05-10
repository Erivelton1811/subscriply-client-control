
import { StateCreator } from 'zustand';
import { SubscriptionState, SystemSlice } from '../types';
import { plans as initialPlans, customers as initialCustomers } from '@/data/mockData';
import { toast } from "sonner";

export const createSystemSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  SystemSlice
> = (set) => ({
  resetToInitialData: () => {
    set({
      plans: initialPlans,
      customers: initialCustomers,
    });
    toast.success("Dados redefinidos para o padrão inicial");
  },
});
