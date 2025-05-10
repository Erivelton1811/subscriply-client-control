
import { Plan, Customer } from '../types';

// Helper to generate ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Default userId for mock data
const defaultUserId = "eriveltonadmin"; // ID do usuário admin padrão

// Mock Plans
export const plans: Plan[] = [
  {
    id: "plan1",
    name: "Básico",
    price: 29.90,
    duration: 30, // 30 days
    description: "Acesso básico aos serviços",
    userId: defaultUserId
  },
  {
    id: "plan2",
    name: "Premium",
    price: 59.90,
    duration: 30, // 30 days
    description: "Acesso completo com suporte prioritário",
    userId: defaultUserId
  },
  {
    id: "plan3",
    name: "Empresarial",
    price: 99.90,
    duration: 30, // 30 days
    description: "Ideal para pequenas empresas com múltiplos acessos",
    userId: defaultUserId
  },
  {
    id: "plan4",
    name: "Anual Básico",
    price: 299.90,
    duration: 365, // 365 days
    description: "Plano básico com pagamento anual (economia de 15%)",
    userId: defaultUserId
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

// Adicionando userId para todos os clientes
// Using the defaultUserId already declared above

export const customers: Customer[] = [
  {
    id: "cust1",
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "(11) 98765-4321",
    status: "active",
    subscriptions: [
      {
        id: generateId(),
        planId: "plan1",
        startDate: fifteenDaysAgo.toISOString(),
      }
    ],
    userId: defaultUserId
  },
  {
    id: "cust2",
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    status: "active",
    subscriptions: [
      {
        id: generateId(),
        planId: "plan2",
        startDate: thirtyDaysAgo.toISOString(),
      }
    ],
    userId: defaultUserId
  },
  {
    id: "cust3",
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    phone: "(21) 99876-5432",
    status: "active",
    subscriptions: [
      {
        id: generateId(),
        planId: "plan3",
        startDate: fiveDaysAgo.toISOString(),
      },
      {
        id: generateId(),
        planId: "plan1",
        startDate: today.toISOString(),
      }
    ],
    userId: defaultUserId
  },
  {
    id: "cust4",
    name: "Ana Costa",
    email: "ana.costa@example.com",
    status: "active",
    subscriptions: [
      {
        id: generateId(),
        planId: "plan4",
        startDate: today.toISOString(),
      }
    ],
    userId: defaultUserId
  }
];
