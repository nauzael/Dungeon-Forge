import { useCallback, useRef } from 'react';

export const useModalScrollLock = () => {
  const scrollYRef = useRef<number>(0);

  const lockScroll = useCallback(() => {
    // Guardar la posición actual del scroll
    scrollYRef.current = window.scrollY;

    // Prevenir scroll en el body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';

    // Agregar clase para estilos adicionales si es necesario
    document.body.classList.add('modal-open');
  }, []);

  const unlockScroll = useCallback(() => {
    // Restaurar el scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // Restaurar la posición del scroll
    window.scrollTo(0, scrollYRef.current);

    // Remover clase
    document.body.classList.remove('modal-open');
  }, []);

  return { lockScroll, unlockScroll };
};

export default useModalScrollLock;
