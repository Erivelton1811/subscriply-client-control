
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

/**
 * Hook para sincronizar dados e invalidar caches automaticamente quando houver mudanças
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  
  // Função para invalidar todos os caches relevantes
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    queryClient.invalidateQueries({ queryKey: ["plans"] });
    queryClient.invalidateQueries({ queryKey: ["reports"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  // Usamos useEffect para monitorar mudanças em estados relevantes
  useEffect(() => {
    // Só sincronizamos se o usuário estiver autenticado
    if (!isAuthenticated) return;
    
    // Definimos os listeners para as ações do store
    const unsubscribeCustomers = useSubscriptionStore.subscribe(
      (state) => {
        console.log("Clientes modificados, invalidando cache...");
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    );
    
    const unsubscribePlans = useSubscriptionStore.subscribe(
      (state) => {
        console.log("Planos modificados, invalidando cache...");
        queryClient.invalidateQueries({ queryKey: ["plans"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      }
    );
    
    const unsubscribeReports = useSubscriptionStore.subscribe(
      (state) => {
        console.log("Relatórios modificados, invalidando cache...");
        queryClient.invalidateQueries({ queryKey: ["reports"] });
      }
    );
    
    // Invalidamos tudo ao montar o componente
    invalidateAll();
    
    // Limpeza dos listeners ao desmontar
    return () => {
      unsubscribeCustomers();
      unsubscribePlans();
      unsubscribeReports();
    };
  }, [queryClient, isAuthenticated]);

  return { invalidateAll };
}
