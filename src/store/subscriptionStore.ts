
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
      plans: [],
      customers: [],
      
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
      onRehydrateStorage: () => (state) => {
        // Verificar se há dados após o carregamento
        if (!state) return;
        
        // Se não houver dados de clientes ou planos, carregar os dados iniciais
        if ((!state.customers || state.customers.length === 0) && 
            (!state.plans || state.plans.length === 0)) {
          setTimeout(() => {
            // Usar o resetToInitialData após o componente estar montado
            useSubscriptionStore.getState().resetToInitialData();
          }, 0);
        }
      }
    }
  )
);
