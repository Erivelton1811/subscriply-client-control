
import { create } from 'zustand';
import { plans as initialPlans, customers as initialCustomers } from '../data/mockData';
import { Plan, Customer, CustomerWithPlanDetails, ReportData } from '../types';
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
  assignPlanToCustomer: (customerId: string, planId: string) => void;
  renewSubscription: (customerId: string, planId?: string) => void;
  
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
      status: customer.status || "active",
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
      const plan = plans.find(p => p.id === customer.planId);
      if (!plan) return null;
      
      // Handle inactive customers separately
      if (customer.status === "inactive") {
        return {
          ...customer,
          plan,
          daysRemaining: 0,
          status: 'inactive' as const
        };
      }
      
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
    
    // Handle inactive customers separately
    if (customer.status === "inactive") {
      return {
        ...customer,
        plan,
        daysRemaining: 0,
        status: 'inactive' as const
      };
    }
    
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
  },
  
  // New functions for profit calculations
  getExpectedMonthlyProfit: () => {
    const { getCustomerDetails, plans } = get();
    
    const activeCustomers = getCustomerDetails().filter(
      c => c.status !== 'inactive' && (c.status === 'active' || c.status === 'warning')
    );
    
    let totalProfit = 0;
    
    activeCustomers.forEach(customer => {
      const plan = plans.find(p => p.id === customer.plan.id);
      if (!plan) return;
      
      // Calculate profit per plan
      const profitPerPlan = plan.price - (plan.resalePrice || 0);
      
      // Calculate daily profit (profit per plan divided by duration)
      const dailyProfit = profitPerPlan / plan.duration;
      
      // Calculate monthly profit (assuming 30 days in a month)
      const monthlyProfit = dailyProfit * 30;
      
      totalProfit += monthlyProfit;
    });
    
    return totalProfit;
  },
  
  getExpectedYearlyProfit: () => {
    const monthlyProfit = get().getExpectedMonthlyProfit();
    return monthlyProfit * 12;
  },
  
  getAverageSubscriptionValue: () => {
    const { getCustomerDetails } = get();
    
    const activeCustomers = getCustomerDetails().filter(
      c => c.status !== 'inactive' && (c.status === 'active' || c.status === 'warning')
    );
    
    if (activeCustomers.length === 0) return 0;
    
    const totalValue = activeCustomers.reduce((sum, customer) => sum + customer.plan.price, 0);
    return totalValue / activeCustomers.length;
  }
}));
