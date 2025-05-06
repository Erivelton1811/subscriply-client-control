
import { Plan, Customer } from '../types';

// Helper to generate ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Mock Plans
export const plans: Plan[] = [
  {
    id: "plan1",
    name: "Básico",
    price: 29.90,
    duration: 30, // 30 days
    description: "Acesso básico aos serviços"
  },
  {
    id: "plan2",
    name: "Premium",
    price: 59.90,
    duration: 30, // 30 days
    description: "Acesso completo com suporte prioritário"
  },
  {
    id: "plan3",
    name: "Empresarial",
    price: 99.90,
    duration: 30, // 30 days
    description: "Ideal para pequenas empresas com múltiplos acessos"
  },
  {
    id: "plan4",
    name: "Anual Básico",
    price: 299.90,
    duration: 365, // 365 days
    description: "Plano básico com pagamento anual (economia de 15%)"
  }
];

// Mock Customers
const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);
const fifteenDaysAgo = new Date();
fifteenDaysAgo.setDate(today.getDate() - 15);
const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(today.getDate() - 5);

export const customers: Customer[] = [
  {
    id: "cust1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    planId: "plan1",
    startDate: fifteenDaysAgo.toISOString()
  },
  {
    id: "cust2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    planId: "plan2",
    startDate: thirtyDaysAgo.toISOString()
  },
  {
    id: "cust3",
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    phone: "(21) 99876-5432",
    planId: "plan3",
    startDate: fiveDaysAgo.toISOString()
  },
  {
    id: "cust4",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    planId: "plan4",
    startDate: today.toISOString()
  }
];
