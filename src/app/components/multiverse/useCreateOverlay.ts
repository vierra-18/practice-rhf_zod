import { useOverlayContext } from './OverlayProvider';
import type { OverlayConfig } from './OverlayProvider';
import { useCallback, useEffect, useRef } from 'react';

function useCreateOverlay<TState>(initialState: TState) {
  const { createOverlay, updateState } = useOverlayContext();
  const overlayIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    overlayIdsRef.current.forEach((id) => {
      updateState(id, initialState);
    });
  }, [initialState, updateState]);

  return useCallback(
    (config: OverlayConfig<TState>) => {
      const id = createOverlay(config, initialState);
      overlayIdsRef.current.add(id);
      return id;
    },
    [createOverlay, initialState]
  );
}

export default useCreateOverlay;
