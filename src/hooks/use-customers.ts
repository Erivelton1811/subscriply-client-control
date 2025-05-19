
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomerWithPlanDetails } from "@/types";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";

/**
 * Custom hook para obter clientes com detalhes dos planos
 * Inclui sincronização automática e invalidação de cache
 */
export function useCustomers() {
  const getCustomerDetails = useSubscriptionStore(state => state.getCustomerDetails);
  const currentUser = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  
  const { data = [], isLoading } = useQuery({
    queryKey: ["customers", currentUser?.username],
    queryFn: () => {
      console.log(`Buscando dados atualizados de clientes para o usuário: ${currentUser?.username}`);
      // Retorna os detalhes do cliente do store filtrados pelo usuário atual
      const customers = getCustomerDetails();
      return Array.isArray(customers) ? customers : [];
    },
    // Configurações específicas para esta consulta
    refetchOnMount: true,
    refetchOnReconnect: true,
    enabled: !!currentUser,
  });
  
  return { customers: data, isLoading };
}

/**
 * Custom hook para obter detalhes de um cliente específico
 */
export function useCustomerById(customerId: string | undefined) {
  const getCustomerById = useSubscriptionStore(state => state.getCustomerById);
  const currentUser = useAuthStore(state => state.user);
  
  const { data, isLoading } = useQuery({
    queryKey: ["customers", currentUser?.username, customerId],
    queryFn: () => {
      if (!customerId || !currentUser) return null;
      console.log(`Buscando dados do cliente ${customerId} para o usuário ${currentUser.username}...`);
      return getCustomerById(customerId);
    },
    enabled: !!customerId && !!currentUser, // Só executa se houver um ID e um usuário logado
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  
  return { customer: data, isLoading };
}
