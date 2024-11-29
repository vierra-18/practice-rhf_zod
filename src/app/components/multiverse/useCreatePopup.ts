import { usePopupContext } from './PopupProvider';
import type { PopupConfig } from './PopupProvider';
import { useCallback, useEffect, useRef } from 'react';

function useCreatePopup<TState>(initialState: TState) {
  const { createPopup, updateState } = usePopupContext();
  const popupIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    popupIdsRef.current.forEach((id) => {
      updateState(id, initialState);
    });
  }, [initialState, updateState]);

  return useCallback(
    (config: PopupConfig<TState>) => {
      const id = createPopup(config, initialState);
      popupIdsRef.current.add(id);
      return id;
    },
    [createPopup, initialState]
  );
}

export default useCreatePopup;
