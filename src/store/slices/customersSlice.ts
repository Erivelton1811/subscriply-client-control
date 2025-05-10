
import { StateCreator } from 'zustand';
import { SubscriptionState, CustomersSlice } from '../types';
import { CustomerWithPlanDetails } from '@/types';
import { toast } from "sonner";
import { useAuthStore } from '../authStore';

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
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para atualizar um cliente");
      return;
    }
    
    set((state) => ({
      customers: state.customers.map((customer) => 
        customer.id === id && customer.userId === currentUser.username 
          ? { ...customer, ...updatedCustomer } 
          : customer
      ),
    }));
    toast.success("Cliente atualizado com sucesso");
  },
  
  deleteCustomer: (id) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para excluir um cliente");
      return;
    }
    
    set((state) => ({
      customers: state.customers.filter((customer) => 
        !(customer.id === id && customer.userId === currentUser.username)
      ),
    }));
    toast.success("Cliente excluído com sucesso");
  },
  
  addSubscriptionToCustomer: (customerId, planId, startDate) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para adicionar uma assinatura");
      return;
    }
    
    const newSubscription = {
      id: Math.random().toString(36).substring(2, 11),
      planId,
      startDate: startDate || new Date().toISOString(),
    };
    
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId && customer.userId === currentUser.username
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
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para renovar uma assinatura");
      return;
    }
    
    const customer = get().customers.find(c => c.id === customerId && c.userId === currentUser.username);
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
          c.id === customerId && c.userId === currentUser.username
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
          c.id === customerId && c.userId === currentUser.username
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
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) {
      toast.error("Você precisa estar logado para remover uma assinatura");
      return;
    }
    
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId && customer.userId === currentUser.username
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
    
    if (!currentUser) {
      console.log("Usuário não autenticado, retornando lista vazia");
      return [];
    }
    
    // Filtrar clientes pelo usuário atual
    const userCustomers = customers.filter(customer => customer.userId === currentUser.username);
    console.log(`Encontrados ${userCustomers.length} clientes para o usuário ${currentUser.username}`);
    
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
    const currentUser = useAuthStore.getState().user;
    
    if (!currentUser) {
      console.log("Usuário não autenticado, retornando undefined");
      return undefined;
    }
    
    const customer = customers.find(c => c.id === id && c.userId === currentUser.username);
    if (!customer) {
      console.log(`Cliente ${id} não encontrado para o usuário ${currentUser.username}`);
      return undefined;
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
