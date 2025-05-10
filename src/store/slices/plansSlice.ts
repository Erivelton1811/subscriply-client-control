
import { StateCreator } from 'zustand';
import { SubscriptionState, PlansSlice } from '../types';
import { toast } from "sonner";
import { useAuthStore } from '../authStore';

export const createPlansSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  PlansSlice
> = (set, get) => ({
  plans: [],
  
  addPlan: (plan) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para adicionar um plano");
      return;
    }
    
    const newPlan = { 
      ...plan, 
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.username // Associar o plano ao usuário atual
    };
    
    set((state) => ({ plans: [...state.plans, newPlan] }));
    toast.success("Plano adicionado com sucesso");
  },
  
  updatePlan: (id, updatedPlan) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para atualizar um plano");
      return;
    }
    
    set((state) => ({
      plans: state.plans.map((plan) => 
        plan.id === id && plan.userId === currentUser.username ? { ...plan, ...updatedPlan } : plan
      ),
    }));
    toast.success("Plano atualizado com sucesso");
  },
  
  deletePlan: (id) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para excluir um plano");
      return;
    }
    
    // Check if any customer is using this plan
    const { customers } = get();
    const isUsed = customers.some(customer => 
      customer.userId === currentUser.username && 
      customer.subscriptions.some(sub => sub.planId === id)
    );
    
    if (isUsed) {
      toast.error("Não é possível excluir um plano que está em uso");
      return;
    }
    
    set((state) => ({
      plans: state.plans.filter((plan) => !(plan.id === id && plan.userId === currentUser.username)),
    }));
    toast.success("Plano excluído com sucesso");
  },
  
  getPlanById: (id) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return undefined;
    
    return get().plans.find(plan => plan.id === id && plan.userId === currentUser.username);
  },
});
