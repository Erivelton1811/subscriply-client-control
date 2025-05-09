
import { StateCreator } from 'zustand';
import { SubscriptionState } from '../types';
import { toast } from "sonner";

export const createPlansSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  Pick<SubscriptionState, keyof SubscriptionState>
> = (set, get) => ({
  plans: [],
  
  addPlan: (plan) => {
    const newPlan = { ...plan, id: Math.random().toString(36).substring(2, 11) };
    set((state) => ({ plans: [...state.plans, newPlan] }));
    toast.success("Plano adicionado com sucesso");
  },
  
  updatePlan: (id, updatedPlan) => {
    set((state) => ({
      plans: state.plans.map((plan) => 
        plan.id === id ? { ...plan, ...updatedPlan } : plan
      ),
    }));
    toast.success("Plano atualizado com sucesso");
  },
  
  deletePlan: (id) => {
    // Check if any customer is using this plan
    const { customers } = get();
    const isUsed = customers.some(customer => 
      customer.subscriptions.some(sub => sub.planId === id)
    );
    
    if (isUsed) {
      toast.error("Não é possível excluir um plano que está em uso");
      return;
    }
    
    set((state) => ({
      plans: state.plans.filter((plan) => plan.id !== id),
    }));
    toast.success("Plano excluído com sucesso");
  },
  
  getPlanById: (id) => {
    return get().plans.find(plan => plan.id === id);
  },
});
