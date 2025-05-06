
import { create } from 'zustand';
import { plans as initialPlans, customers as initialCustomers } from '../data/mockData';
import { Plan, Customer, CustomerWithPlanDetails } from '../types';
import { toast } from "sonner";

interface SubscriptionState {
  plans: Plan[];
  customers: Customer[];
  
  // Plans actions
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, updatedPlan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  
  // Customers actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Customer subscription actions
  assignPlanToCustomer: (customerId: string, planId: string) => void;
  renewSubscription: (customerId: string, planId?: string) => void;
  
  // Utils
  getCustomerDetails: () => CustomerWithPlanDetails[];
  getCustomerById: (id: string) => CustomerWithPlanDetails | undefined;
  getPlanById: (id: string) => Plan | undefined;
  getActiveSubscriptions: () => number;
  getExpiringSubscriptions: () => number;
  getExpiredSubscriptions: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: initialPlans,
  customers: initialCustomers,
  
  // Plans actions
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
    const isUsed = customers.some(customer => customer.planId === id);
    
    if (isUsed) {
      toast.error("Não é possível excluir um plano que está em uso");
      return;
    }
    
    set((state) => ({
      plans: state.plans.filter((plan) => plan.id !== id),
    }));
    toast.success("Plano excluído com sucesso");
  },
  
  // Customers actions
  addCustomer: (customer) => {
    const newCustomer = { 
      ...customer, 
      id: Math.random().toString(36).substring(2, 11),
      startDate: new Date().toISOString() 
    };
    
    set((state) => ({ customers: [...state.customers, newCustomer] }));
    toast.success("Cliente adicionado com sucesso");
  },
  
  updateCustomer: (id, updatedCustomer) => {
    set((state) => ({
      customers: state.customers.map((customer) => 
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      ),
    }));
    toast.success("Cliente atualizado com sucesso");
  },
  
  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }));
    toast.success("Cliente excluído com sucesso");
  },
  
  // Customer subscription actions
  assignPlanToCustomer: (customerId, planId) => {
    set((state) => ({
      customers: state.customers.map((customer) => 
        customer.id === customerId 
          ? { ...customer, planId, startDate: new Date().toISOString() } 
          : customer
      ),
    }));
    toast.success("Plano atribuído com sucesso");
  },
  
  renewSubscription: (customerId, planId) => {
    const customer = get().customers.find(c => c.id === customerId);
    if (!customer) return;
    
    set((state) => ({
      customers: state.customers.map((c) => 
        c.id === customerId
          ? { ...c, planId: planId || c.planId, startDate: new Date().toISOString() }
          : c
      ),
    }));
    toast.success("Assinatura renovada com sucesso");
  },
  
  // Utils
  getCustomerDetails: () => {
    const { customers, plans } = get();
    
    return customers.map(customer => {
      const plan = plans.find(p => p.id === customer.planId);
      if (!plan) return null;
      
      const startDate = new Date(customer.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + plan.duration);
      
      const today = new Date();
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status: 'active' | 'expired' | 'warning' = 'active';
      if (daysRemaining <= 0) {
        status = 'expired';
      } else if (daysRemaining <= 5) {
        status = 'warning';
      }
      
      return {
        ...customer,
        plan,
        daysRemaining,
        status
      };
    }).filter(Boolean) as CustomerWithPlanDetails[];
  },
  
  getCustomerById: (id) => {
    const { customers, plans } = get();
    const customer = customers.find(c => c.id === id);
    if (!customer) return undefined;
    
    const plan = plans.find(p => p.id === customer.planId);
    if (!plan) return undefined;
    
    const startDate = new Date(customer.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.duration);
    
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let status: 'active' | 'expired' | 'warning' = 'active';
    if (daysRemaining <= 0) {
      status = 'expired';
    } else if (daysRemaining <= 5) {
      status = 'warning';
    }
    
    return {
      ...customer,
      plan,
      daysRemaining,
      status
    };
  },
  
  getPlanById: (id) => {
    return get().plans.find(plan => plan.id === id);
  },
  
  getActiveSubscriptions: () => {
    return get().getCustomerDetails().filter(c => c.status === 'active').length;
  },
  
  getExpiringSubscriptions: () => {
    return get().getCustomerDetails().filter(c => c.status === 'warning').length;
  },
  
  getExpiredSubscriptions: () => {
    return get().getCustomerDetails().filter(c => c.status === 'expired').length;
  }
}));
