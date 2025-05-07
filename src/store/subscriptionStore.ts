
import { create } from 'zustand';
import { plans as initialPlans, customers as initialCustomers } from '../data/mockData';
import { Plan, Customer, CustomerWithPlanDetails, ReportData, CustomerSubscription } from '../types';
import { toast } from "sonner";

// Initial reports configuration
const initialReports: ReportData[] = [
  { 
    id: "monthly-profit", 
    title: "Lucro Mensal Esperado", 
    description: "Estimativa de lucro mensal baseada em assinaturas ativas", 
    visible: true 
  },
  { 
    id: "yearly-profit", 
    title: "Lucro Anual Esperado", 
    description: "Estimativa de lucro anual baseada em assinaturas ativas", 
    visible: true 
  },
  { 
    id: "expiring-subscriptions", 
    title: "Assinaturas Próximas do Vencimento", 
    description: "Clientes com assinaturas que vencem nos próximos 5 dias", 
    visible: true 
  },
  { 
    id: "renewal-rate", 
    title: "Taxa de Renovação", 
    description: "Porcentagem de clientes que renovam suas assinaturas", 
    visible: true 
  },
  { 
    id: "avg-subscription-value", 
    title: "Valor Médio de Assinatura", 
    description: "Média do valor das assinaturas ativas", 
    visible: true 
  },
  { 
    id: "customer-retention", 
    title: "Retenção de Clientes", 
    description: "Análise de retenção de clientes ao longo do tempo", 
    visible: true 
  },
  { 
    id: "profit-per-plan", 
    title: "Lucro por Plano", 
    description: "Distribuição de lucro por tipo de plano", 
    visible: true 
  },
];

interface SubscriptionState {
  plans: Plan[];
  customers: Customer[];
  reports: ReportData[];
  
  // Plans actions
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, updatedPlan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  
  // Customers actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Customer subscription actions
  addSubscriptionToCustomer: (customerId: string, planId: string, startDate?: string) => void;
  renewSubscription: (customerId: string, subscriptionId: string, planId?: string) => void;
  removeSubscription: (customerId: string, subscriptionId: string) => void;
  
  // Report actions
  toggleReportVisibility: (reportId: string) => void;

  // Utils
  getCustomerDetails: () => CustomerWithPlanDetails[];
  getCustomerById: (id: string) => CustomerWithPlanDetails | undefined;
  getPlanById: (id: string) => Plan | undefined;
  getActiveSubscriptions: () => number;
  getExpiringSubscriptions: () => number;
  getExpiredSubscriptions: () => number;
  getExpectedMonthlyProfit: () => number;
  getExpectedYearlyProfit: () => number;
  getAverageSubscriptionValue: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  plans: initialPlans,
  customers: initialCustomers,
  reports: initialReports,
  
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
  
  // Customers actions
  addCustomer: (customer) => {
    const newCustomer = { 
      ...customer, 
      id: Math.random().toString(36).substring(2, 11),
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
  addSubscriptionToCustomer: (customerId, planId, startDate) => {
    const newSubscription: CustomerSubscription = {
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
  
  // Report actions
  toggleReportVisibility: (reportId) => {
    set((state) => ({
      reports: state.reports.map((report) => 
        report.id === reportId 
          ? { ...report, visible: !report.visible } 
          : report
      )
    }));
  },
  
  // Utils
  getCustomerDetails: () => {
    const { customers, plans } = get();
    
    return customers.map(customer => {
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
  
  getPlanById: (id) => {
    return get().plans.find(plan => plan.id === id);
  },
  
  getActiveSubscriptions: () => {
    const customers = get().getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'active').length;
    }, 0);
  },
  
  getExpiringSubscriptions: () => {
    const customers = get().getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'warning').length;
    }, 0);
  },
  
  getExpiredSubscriptions: () => {
    const customers = get().getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'expired').length;
    }, 0);
  },
  
  // New functions for profit calculations
  getExpectedMonthlyProfit: () => {
    const { getCustomerDetails, plans } = get();
    const customers = getCustomerDetails();
    
    let totalProfit = 0;
    
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        if (subscription.status === 'active' || subscription.status === 'warning') {
          const plan = plans.find(p => p.id === subscription.plan.id);
          if (!plan) return;
          
          // Calculate profit per plan
          const profitPerPlan = plan.price - (plan.resalePrice || 0);
          
          // Calculate daily profit (profit per plan divided by duration)
          const dailyProfit = profitPerPlan / plan.duration;
          
          // Calculate monthly profit (assuming 30 days in a month)
          const monthlyProfit = dailyProfit * 30;
          
          totalProfit += monthlyProfit;
        }
      });
    });
    
    return totalProfit;
  },
  
  getExpectedYearlyProfit: () => {
    const monthlyProfit = get().getExpectedMonthlyProfit();
    return monthlyProfit * 12;
  },
  
  getAverageSubscriptionValue: () => {
    const { getCustomerDetails } = get();
    const customers = getCustomerDetails();
    
    let totalValue = 0;
    let totalActiveSubscriptions = 0;
    
    customers.forEach(customer => {
      customer.subscriptions.forEach(subscription => {
        if (subscription.status === 'active' || subscription.status === 'warning') {
          totalValue += subscription.plan.price;
          totalActiveSubscriptions++;
        }
      });
    });
    
    return totalActiveSubscriptions > 0 ? totalValue / totalActiveSubscriptions : 0;
  }
}));
