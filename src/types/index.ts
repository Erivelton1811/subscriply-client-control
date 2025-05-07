
export interface Plan {
  id: string;
  name: string;
  price: number;
  resalePrice?: number; // Added resale price field
  duration: number; // in days
  description: string;
}

export interface CustomerSubscription {
  id: string;
  planId: string;
  startDate: string; // ISO date string
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  subscriptions: CustomerSubscription[];
}

export interface CustomerWithPlanDetails extends Omit<Customer, "subscriptions"> {
  subscriptions: Array<{
    id: string;
    plan: Plan;
    daysRemaining: number;
    status: 'active' | 'expired' | 'warning';
    startDate: string;
  }>;
}

// New interface for reports data
export interface ReportData {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}
