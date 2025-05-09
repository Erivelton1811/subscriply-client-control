
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPlansSlice } from './slices/plansSlice';
import { createCustomersSlice } from './slices/customersSlice';
import { createReportsSlice } from './slices/reportsSlice';
import { createAnalyticsSlice } from './slices/analyticsSlice';
import { createSystemSlice } from './slices/systemSlice';
import { SubscriptionState } from './types';
import { plans as initialPlans, customers as initialCustomers } from '../data/mockData';

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get, api) => ({
      // Inicializar os planos e clientes com os dados mockados
      plans: initialPlans,
      customers: initialCustomers,
      
      // Combinar todos os slices
      ...createPlansSlice(set, get, api),
      ...createCustomersSlice(set, get, api),
      ...createReportsSlice(set, get, api),
      ...createAnalyticsSlice(set, get, api),
      ...createSystemSlice(set, get, api)
    }),
    {
      name: 'subscriply-storage', // nome usado no localStorage
      partialize: (state) => ({ 
        plans: state.plans, 
        customers: state.customers,
        reports: state.reports
      }),
    }
  )
);
