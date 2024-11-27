import { useModalContext } from './ModalProvider';
import type { ModalConfig } from './ModalProvider';
import { useCallback, useEffect, useRef } from 'react';

function useCreateModal<TState>(initialState: TState) {
  const { createModal, updateState } = useModalContext();
  const modalIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    modalIdsRef.current.forEach((id) => {
      updateState(id, initialState);
    });
  }, [initialState, updateState]);

  return useCallback(
    (config: ModalConfig<TState>) => {
      const id = createModal(config, initialState);
      modalIdsRef.current.add(id);
      return id;
    },
    [createModal, initialState]
  );
}

export default useCreateModal;
