
import { StateCreator } from 'zustand';
import { SubscriptionState, AnalyticsSlice } from '../types';

export const createAnalyticsSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  AnalyticsSlice
> = (get) => ({
  getActiveSubscriptions: () => {
    const state = get() as SubscriptionState;
    const customers = state.getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'active').length;
    }, 0);
  },
  
  getExpiringSubscriptions: () => {
    const state = get() as SubscriptionState;
    const customers = state.getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'warning').length;
    }, 0);
  },
  
  getExpiredSubscriptions: () => {
    const state = get() as SubscriptionState;
    const customers = state.getCustomerDetails();
    return customers.reduce((count, customer) => {
      return count + customer.subscriptions.filter(sub => sub.status === 'expired').length;
    }, 0);
  },
  
  getExpectedMonthlyProfit: () => {
    const state = get() as SubscriptionState;
    const customers = state.getCustomerDetails();
    const plans = state.plans;
    
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
    const state = get() as SubscriptionState;
    const monthlyProfit = state.getExpectedMonthlyProfit();
    return monthlyProfit * 12;
  },
  
  getAverageSubscriptionValue: () => {
    const state = get() as SubscriptionState;
    const customers = state.getCustomerDetails();
    
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
});
