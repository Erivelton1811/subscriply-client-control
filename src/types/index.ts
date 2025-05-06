
export interface Plan {
  id: string;
  name: string;
  price: number;
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
}

export interface CustomerWithPlanDetails extends Omit<Customer, 'planId'> {
  plan: Plan;
  daysRemaining: number;
  status: 'active' | 'expired' | 'warning';
}
