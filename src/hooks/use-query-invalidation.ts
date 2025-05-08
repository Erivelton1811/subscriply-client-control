
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
  
  // Acessamos o store para adicionar listeners
  const storeActions = useSubscriptionStore();
  
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
    const unsubscribers = [
      // Subscribes para ações relacionadas a clientes
      useSubscriptionStore.subscribe(
        (state) => state.customers,
        () => {
          console.log("Clientes modificados, invalidando cache...");
          queryClient.invalidateQueries({ queryKey: ["customers"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
      ),
      
      // Subscribes para ações relacionadas a planos
      useSubscriptionStore.subscribe(
        (state) => state.plans,
        () => {
          console.log("Planos modificados, invalidando cache...");
          queryClient.invalidateQueries({ queryKey: ["plans"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
      ),
      
      // Subscribes para ações relacionadas a relatórios
      useSubscriptionStore.subscribe(
        (state) => state.reports,
        () => {
          console.log("Relatórios modificados, invalidando cache...");
          queryClient.invalidateQueries({ queryKey: ["reports"] });
        }
      ),
    ];
    
    // Invalidamos tudo ao montar o componente
    invalidateAll();
    
    // Limpeza dos listeners ao desmontar
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [queryClient, isAuthenticated]);

  return { invalidateAll };
}
