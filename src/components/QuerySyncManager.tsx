
import { useQueryInvalidation } from "@/hooks/use-query-invalidation";

/**
 * Componente responsável por sincronizar os dados e invalidar caches automaticamente
 * Ele não renderiza nada visualmente, apenas gerencia a sincronização
 */
export function QuerySyncManager() {
  // Usa o hook de invalidação de queries
  useQueryInvalidation();
  
  // Este componente não renderiza nada visual
  return null;
}
