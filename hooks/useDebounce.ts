import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores.
 * Retorna el valor debounceado después del delay especificado.
 * 
 * @param value - El valor a debounce
 * @param delay - Milisegundos de espera antes de actualizar
 * @returns El valor debounceado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
