
import { StateCreator } from 'zustand';
import { SubscriptionState, ReportsSlice } from '../types';
import { ReportData } from '@/types';

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

export const createReportsSlice: StateCreator<
  SubscriptionState,
  [],
  [],
  ReportsSlice
> = (set) => ({
  reports: initialReports,
  
  toggleReportVisibility: (reportId) => {
    set((state) => ({
      reports: state.reports.map((report) => 
        report.id === reportId 
          ? { ...report, visible: !report.visible } 
          : report
      )
    }));
  },
});
