import { useState, useCallback } from 'react';

/**
 * Hook para manejar estados de funciones asíncronas (carga, error, datos)
 */
export function useAsync<T, Args extends any[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (e: any) {
        const errorMessage = e.response?.data?.message || e.message || 'Ocurrió un error inesperado';
        setError(errorMessage);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, isLoading, error, data, setData, reset };
}
