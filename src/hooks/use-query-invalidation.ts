
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para gerenciar a invalidação de consultas React Query
 * Usado para garantir que as consultas sejam atualizadas quando os dados do store mudam
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();
  
  // Monitora mudanças no localStorage para dados persistentes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'subscriply-storage') {
        // Quando os dados persistidos mudarem, invalida as queries para forçar recarregamento
        console.log('Dados persistidos foram alterados, invalidando consultas...');
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [queryClient]);
  
  return null;
}
