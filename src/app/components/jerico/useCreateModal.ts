import { isEqual } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import { useModalContext } from "./ModalProvider";

type CreateModalProp<TState> = {
	title?: string;
	content:
		| ((close: () => void, minimize: () => void) => React.ReactNode)
		| ((
				close: () => void,
				minimize: () => void
		  ) => (state: TState) => React.ReactNode);
};

const useCreateModal = <TState>(key = "modal", state?: TState) => {
	const { setModals, setStates } = useModalContext();
	const prevStateRef = useRef<TState | null>(null);

	useEffect(() => {
		if (!state) return;
		if (isEqual(prevStateRef.current, state)) return;
		prevStateRef.current = state;
		setStates((prev) => ({ ...prev, [key]: state }));
	}, [state, setStates, key]);

	const createModal = useCallback(
		({ title = "Unnamed Tab", content }: CreateModalProp<TState>) => {
			const modalKey = `${key}-${Date.now()}`;
			const minimizeModal = () =>
				setModals((prev) =>
					prev.map((modal) =>
						modal.key === modalKey
							? {
									...modal,
									status: "minimize",
							  }
							: modal
					)
				);

			const closeThisModal = () => {
				setModals((prev) => prev.filter((modal) => modal.key !== modalKey));
			};
			setModals((prev) => [
				...prev,
				{
					key: modalKey,
					hookKey: key,
					title,
					status: "open",
					content: content(closeThisModal, minimizeModal),
				},
			]);
		},
		[key, setModals]
	);
	return createModal;
};

export const useDestroyModals = () => {
	const { setModals, setStates } = useModalContext();

	const destroyModals = useCallback(() => {
		setModals(() => []);
		setStates(() => ({}));
	}, [setModals, setStates]);

	return destroyModals;
};

export default useCreateModal;
