import { useEffect, useCallback } from 'react';

export const useModalScrollLock = () => {
  const lockScroll = useCallback(() => {
    document.body.classList.add('modal-open');
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.classList.remove('modal-open');
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return { lockScroll, unlockScroll };
};

export default useModalScrollLock;
