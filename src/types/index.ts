
export interface Plan {
  id: string;
  name: string;
  price: number;
  resalePrice?: number;
  duration: number;
  description: string;
}

export interface CustomerSubscription {
  id: string;
  planId: string;
  startDate: string;
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

export interface ReportData {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

// Auth related interfaces
export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users?: User[];
}

// System settings interface
export interface SystemSettings {
  notificationEmail: string;
  enableEmailNotifications: boolean;
  subscriptionWarningDays: number;
  companyName: string;
  companyLogo?: string;
  allowUserRegistration: boolean;
  theme: 'light' | 'dark' | 'system';
}
