
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
      // Inicializar planos e clientes vazios; os dados serão carregados do localStorage ou mockData
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
        if (!state) {
          console.log("Nenhum estado encontrado no localStorage, carregando dados iniciais...");
          setTimeout(() => {
            useSubscriptionStore.getState().resetToInitialData();
          }, 0);
          return;
        }
        
        console.log("Estado recarregado do localStorage:", 
                   `Planos: ${state.plans?.length || 0}`, 
                   `Clientes: ${state.customers?.length || 0}`);
        
        // Somente carregar dados iniciais se não houver dados no localStorage
        if ((!state.customers || state.customers.length === 0) && 
            (!state.plans || state.plans.length === 0)) {
          console.log("Nenhum dado encontrado, carregando dados iniciais...");
          setTimeout(() => {
            useSubscriptionStore.getState().resetToInitialData();
          }, 0);
        }
      }
    }
  )
);
