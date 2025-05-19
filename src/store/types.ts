
import { Plan, Customer, ReportData, CustomerWithPlanDetails } from '../types';

export interface PlansSlice {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id'>) => void;
  updatePlan: (id: string, updatedPlan: Partial<Plan>) => void;
  deletePlan: (id: string) => void;
  getPlanById: (id: string) => Plan | undefined;
}

export interface CustomersSlice {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => string;
  updateCustomer: (id: string, updatedCustomer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addSubscriptionToCustomer: (customerId: string, planId: string, startDate?: string) => void;
  renewSubscription: (customerId: string, subscriptionId: string, planId?: string) => void;
  removeSubscription: (customerId: string, subscriptionId: string) => void;
  getCustomerDetails: () => CustomerWithPlanDetails[];
  getCustomerById: (id: string) => CustomerWithPlanDetails | undefined;
}

export interface ReportsSlice {
  reports: ReportData[];
  toggleReportVisibility: (reportId: string) => void;
}

export interface AnalyticsSlice {
  getActiveSubscriptions: () => number;
  getExpiringSubscriptions: () => number;
  getExpiredSubscriptions: () => number;
  getExpectedMonthlyProfit: () => number;
  getExpectedYearlyProfit: () => number;
  getAverageSubscriptionValue: () => number;
}

export interface SystemSlice {
  resetToInitialData: () => void;
}

export interface SubscriptionState extends 
  PlansSlice, 
  CustomersSlice, 
  ReportsSlice,
  AnalyticsSlice,
  SystemSlice {}
