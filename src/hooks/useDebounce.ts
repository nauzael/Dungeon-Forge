import { useEffect, useRef, useState } from 'react';

/**
 * Hook para aplicar debounce a un valor genérico
 * Retorna el valor debounced tras un delay especificado
 * 
 * @template T - Tipo del valor a debounce
 * @param value - Valor a debounce
 * @param delay - Delay en milisegundos (default: 500ms)
 * @returns Valor debounced
 * 
 * @example
 * ```typescript
 * const [damage, setDamage] = useState(5);
 * const debouncedDamage = useDebounce(damage, 500);
 * 
 * useEffect(() => {
 *   if (damage !== original) {
 *     saveToCloud(debouncedDamage);
 *   }
 * }, [debouncedDamage]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
