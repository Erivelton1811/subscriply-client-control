
import { StateCreator } from 'zustand';
import { SubscriptionState } from '../types';
import { plans as initialPlans, customers as initialCustomers } from '@/data/mockData';
import { toast } from "sonner";

export const createSystemSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  Pick<SubscriptionState, keyof SubscriptionState>
> = (set) => ({
  resetToInitialData: () => {
    set({
      plans: initialPlans,
      customers: initialCustomers,
    });
    toast.success("Dados redefinidos para o padrão inicial");
  },
});
