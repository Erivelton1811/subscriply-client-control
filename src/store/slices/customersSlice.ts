
import { StateCreator } from 'zustand';
import { SubscriptionState, CustomersSlice } from '../types';
import { CustomerWithPlanDetails } from '@/types';
import { toast } from "sonner";
import { useAuthStore } from '../authStore'; // Importamos o authStore

export const createCustomersSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  CustomersSlice
> = (set, get) => ({
  customers: [],
  
  addCustomer: (customer) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para adicionar um cliente");
      return;
    }
    
    const newCustomer = { 
      ...customer, 
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.username // Associamos o cliente ao usuário atual
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
  
  addSubscriptionToCustomer: (customerId, planId, startDate) => {
    const newSubscription = {
      id: Math.random().toString(36).substring(2, 11),
      planId,
      startDate: startDate || new Date().toISOString(),
    };
    
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId
          ? { 
              ...customer, 
              subscriptions: [...customer.subscriptions, newSubscription]
            }
          : customer
      ),
    }));
    toast.success("Assinatura adicionada com sucesso");
  },
  
  renewSubscription: (customerId, subscriptionId, planId) => {
    
    const customer = get().customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const customerDetails = get().getCustomerById(customerId);
    if (!customerDetails) return;
    
    const subscriptionDetails = customerDetails.subscriptions.find(sub => sub.id === subscriptionId);
    if (!subscriptionDetails) return;
    
    const newPlanId = planId || subscriptionDetails.plan.id;
    const newPlan = get().plans.find(p => p.id === newPlanId);
    if (!newPlan) return;
    
    // Calculate new start date considering remaining days
    let newStartDate = new Date();
    
    // If customer has remaining days, accumulate them
    if (subscriptionDetails.daysRemaining > 0) {
      // Adjust the stored date to account for remaining days
      // We subtract the remaining days from the current date for storage
      const adjustedStartDate = new Date();
      adjustedStartDate.setDate(adjustedStartDate.getDate() - subscriptionDetails.daysRemaining);
      
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === customerId
            ? { 
                ...c, 
                subscriptions: c.subscriptions.map(sub => 
                  sub.id === subscriptionId
                    ? { ...sub, planId: newPlanId, startDate: adjustedStartDate.toISOString() }
                    : sub
                )
              }
            : c
        ),
      }));
    } else {
      // No remaining days, just set the new start date to today
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === customerId
            ? { 
                ...c, 
                subscriptions: c.subscriptions.map(sub => 
                  sub.id === subscriptionId
                    ? { ...sub, planId: newPlanId, startDate: newStartDate.toISOString() }
                    : sub
                )
              }
            : c
        ),
      }));
    }
    
    toast.success("Assinatura renovada com sucesso");
  },
  
  removeSubscription: (customerId, subscriptionId) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId
          ? { 
              ...customer, 
              subscriptions: customer.subscriptions.filter(sub => sub.id !== subscriptionId)
            }
          : customer
      ),
    }));
    toast.success("Assinatura removida com sucesso");
  },
  
  getCustomerDetails: () => {
    const { customers, plans } = get();
    const currentUser = useAuthStore.getState().user;
    
    // Filtrar clientes pelo usuário atual
    const userCustomers = currentUser 
      ? customers.filter(customer => customer.userId === currentUser.username)
      : [];
    
    return userCustomers.map(customer => {
      const subscriptionsWithDetails = customer.subscriptions.map(subscription => {
        const plan = plans.find(p => p.id === subscription.planId);
        if (!plan) return null;
        
        const startDate = new Date(subscription.startDate);
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
          id: subscription.id,
          plan,
          daysRemaining,
          status,
          startDate: subscription.startDate
        };
      }).filter(Boolean);
      
      if (subscriptionsWithDetails.length === 0) return null;
      
      return {
        ...customer,
        subscriptions: subscriptionsWithDetails as any
      };
    }).filter(Boolean) as CustomerWithPlanDetails[];
  },
  
  getCustomerById: (id) => {
    const { customers, plans } = get();
    const customer = customers.find(c => c.id === id);
    if (!customer) return undefined;
    
    // Verificar se o cliente pertence ao usuário atual
    const currentUser = useAuthStore.getState().user;
    if (currentUser && customer.userId !== currentUser.username) {
      return undefined; // Cliente não pertence ao usuário atual
    }
    
    // Handle inactive customers separately
    if (customer.status === "inactive") {
      return {
        ...customer,
        subscriptions: customer.subscriptions.map(subscription => {
          const plan = plans.find(p => p.id === subscription.planId);
          if (!plan) return null;
          
          return {
            id: subscription.id,
            plan,
            daysRemaining: 0,
            status: 'expired' as const,
            startDate: subscription.startDate
          };
        }).filter(Boolean) as any[]
      };
    }
    
    const subscriptionsWithDetails = customer.subscriptions.map(subscription => {
      const plan = plans.find(p => p.id === subscription.planId);
      if (!plan) return null;
      
      const startDate = new Date(subscription.startDate);
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
        id: subscription.id,
        plan,
        daysRemaining,
        status,
        startDate: subscription.startDate
      };
    }).filter(Boolean);
    
    if (subscriptionsWithDetails.length === 0) return undefined;
    
    return {
      ...customer,
      subscriptions: subscriptionsWithDetails as any
    };
  },
});
