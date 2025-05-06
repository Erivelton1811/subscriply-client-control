
export interface Plan {
  id: string;
  name: string;
  price: number;
  resalePrice?: number; // Added resale price field
  duration: number; // in days
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  planId: string;
  startDate: string; // ISO date string
  status: 'active' | 'inactive'; // Added status field
}

export interface CustomerWithPlanDetails extends Omit<Customer, 'planId'> {
  plan: Plan;
  daysRemaining: number;
  status: 'active' | 'expired' | 'warning' | 'inactive';
}

// New interface for reports data
export interface ReportData {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}
