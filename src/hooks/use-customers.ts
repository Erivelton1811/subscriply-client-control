
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomerWithPlanDetails } from "@/types";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/**
 * Custom hook para obter clientes com detalhes dos planos
 * Inclui sincronização automática e invalidação de cache
 */
export function useCustomers() {
  const getCustomerDetails = useSubscriptionStore(state => state.getCustomerDetails);
  const queryClient = useQueryClient();
  
  const { data = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => {
      console.log("Buscando dados atualizados de clientes...");
      // Retorna os detalhes do cliente do store
      return getCustomerDetails();
    },
    // Configurações específicas para esta consulta
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  
  return data;
}

/**
 * Custom hook para obter detalhes de um cliente específico
 */
export function useCustomerById(customerId: string | undefined) {
  const getCustomerById = useSubscriptionStore(state => state.getCustomerById);
  
  const { data, isLoading } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => {
      if (!customerId) return null;
      console.log(`Buscando dados do cliente ${customerId}...`);
      return getCustomerById(customerId);
    },
    enabled: !!customerId, // Só executa se houver um ID
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  
  return { customer: data, isLoading };
}
