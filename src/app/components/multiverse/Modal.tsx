"use client";

import React, {
	createContext,
	useContext,
	useRef,
	useCallback,
	useEffect,
	useState,
	type ReactNode,
	memo,
	ComponentProps,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { isEqual } from "lodash";
import { cn } from "../../lib/utilities";
import Button from "./Button";
import Text from "./Text";

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;
type Size = "sm" | "default" | "lg" | "xl" | "2xl" | "3xl";

interface Action<T> {
	label: string | ((state: T) => string);
	onClick: () => void;
}

interface BaseModal<T = any> {
	id: string;
	title: string | ((state: T) => string);
	intent?: Intent;
	size?: Size;
	onClose?: () => void;
	primaryAction?: Action<T>;
	secondaryAction?: Action<T>;
}

interface Modal<T = any> extends BaseModal<T> {
	content: React.ReactNode | ((state: T) => React.ReactNode);
	state?: T;
	parentId?: string; // Track parent modal
}

interface ModalContextType {
	showModal: <T>(modal: Omit<Modal<T>, "id">) => string;
	hideModal: (id: string) => void;
	updateState: <T>(id: string, state: T) => void;
}

const MAP_VARIANT_CLASS: Record<Intent, string> = {
	default: "",
	primary: "bg-brand-subtle text-onBrand-subtle",
	info: "bg-info-subtle text-onInfo-subtle",
	success: "bg-success-subtle text-onSuccess-subtle",
	warning: "bg-warning-subtle text-onWarning-subtle",
	danger: "bg-danger-subtle text-onDanger-subtle",
	inverse: "bg-inverse-subtle text-onInverse-subtle",
};

const MAP_MODAL_WIDTH_CLASS: Record<Size, string> = {
	sm: "max-w-sm",
	default: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
};
const ModalContext = createContext<ModalContextType | null>(null);

const useDynamicContent = <T, V>(
	content: V | ((state: T) => V) | undefined,
	state: T,
	defaultValue: V
) => {
	return React.useMemo(
		() =>
			content
				? typeof content === "function"
					? (content as (state: T) => V)(state)
					: content
				: defaultValue,
		[content, state]
	);
};

const ModalContent = memo(
	<T,>({
		modal,
		onClose,
		zIndex,
		activeModalState,
	}: {
		modal: Modal<T>;
		onClose: () => void;
		zIndex: number;
		activeModalState: T;
	}) => {
		const state = activeModalState;
		const title = useDynamicContent(modal.title, state, "");
		const content = useDynamicContent(modal.content, state, null);
		const primaryLabel = useDynamicContent(
			modal?.primaryAction?.label,
			state,
			""
		);
		const secondaryLabel = useDynamicContent(
			modal?.secondaryAction?.label,
			state,
			""
		);

		useEffect(() => {
			return () => modal.onClose?.();
		}, [modal.onClose]);

		return (
			<motion.div
				className="fixed inset-0 grid max-h-screen place-items-center overflow-y-auto bg-black bg-opacity-50"
				style={{ zIndex }}
				onClick={onClose}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }} // Fade in animation
				exit={{ opacity: 0 }} // Fade out animation
			>
				<motion.div
					className={cn(
						"relative my-10 rounded-lg border border-subtle bg-interface shadow-lg",
						"text flex h-fit w-full flex-col justify-between",
						MAP_MODAL_WIDTH_CLASS[modal.size || "default"]
					)}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 10, opacity: 0 }}
					transition={{ type: "spring", duration: 0.3, bounce: 0.25 }}
					onClick={(e) => e.stopPropagation()}
				>
					<div
						className={cn(
							"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
							"rounded-t-lg border-subtle border-b px-6",
							MAP_VARIANT_CLASS[modal.intent || "default"]
						)}
					>
						<Text size="lead" weight="semibold">
							{title}
						</Text>
						<button
							type="button"
							className="text-2xl hover:shadow-button aspect-square hover:bg-interface-hovered rounded duration-200"
							onClick={onClose}
							aria-label="Close modal"
						>
							<IoCloseOutline />
						</button>
					</div>

					<div className="flex-1 p-6">{content}</div>

					{(modal.primaryAction || modal.secondaryAction) && (
						<div className="flex h-[3.75rem] w-full justify-end gap-1 rounded-b-lg px-6">
							{modal.secondaryAction && (
								<Button
									variant="outline"
									className="capitalize"
									onClick={() => {
										modal.secondaryAction?.onClick();
										onClose();
									}}
								>
									{secondaryLabel}
								</Button>
							)}
							{modal.primaryAction && (
								<Button
									variant="solid"
									intent={modal.intent || "default"}
									className="capitalize"
									onClick={modal.primaryAction.onClick}
								>
									{primaryLabel}
								</Button>
							)}
						</div>
					)}
				</motion.div>
			</motion.div>
		);
	}
);

export const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within ModalProvider");
	}
	return context;
};

export function useShowModal<TState>(initialState?: TState) {
	const { showModal, updateState } = useModal();
	const modalIdRef = useRef<string | null>(null);
	const prevStateRef = useRef<TState | undefined>(initialState);

	useEffect(() => {
		if (!initialState || !modalIdRef.current) return;
		if (isEqual(prevStateRef.current, initialState)) return;

		prevStateRef.current = initialState;
		updateState(modalIdRef.current, initialState);
	}, [initialState, updateState]);

	return useCallback(
		(options: Omit<Modal<TState>, "id" | "state">) => {
			const id = showModal<TState>({ ...options, state: initialState });
			modalIdRef.current = id;
			return id;
		},
		[showModal, initialState]
	);
}

export const ModalProvider = memo(({ children }: { children: ReactNode }) => {
	const modalsRef = useRef<Map<string, Modal<any>>>(new Map());
	const [modals, setModals] = useState<Modal<any>[]>([]);
	const activeStateRef = useRef<any>(null);
	const [activeState, setActiveState] = useState<any>(null);

	const updateAllModalsState = useCallback((state: any) => {
		if (!isEqual(activeStateRef.current, state)) {
			activeStateRef.current = state;
			setActiveState(state);
		}
	}, []);

	const showModal = useCallback(<T,>(modal: Omit<Modal<T>, "id">) => {
		const id = `modal-${Date.now()}`;
		const newModal = { ...modal, id } as Modal<T>;

		// Set initial state if this is the first modal
		if (modalsRef.current.size === 0) {
			activeStateRef.current = modal.state;
			setActiveState(modal.state);
		}

		// Otherwise, use the current active state
		if (
			activeStateRef.current &&
			!isEqual(activeStateRef.current, modal.state)
		) {
			newModal.state = activeStateRef.current;
		}

		modalsRef.current.set(id, newModal);
		setModals(Array.from(modalsRef.current.values()));
		return id;
	}, []);

	const hideModal = useCallback((id: string) => {
		const modal = modalsRef.current.get(id);
		if (modal?.onClose) {
			modal.onClose();
		}
		modalsRef.current.delete(id);
		setModals(Array.from(modalsRef.current.values()));

		// Clear active state if no modals are left
		if (modalsRef.current.size === 0) {
			activeStateRef.current = null;
			setActiveState(null);
		}
	}, []);

	const updateState = useCallback(
		<T,>(id: string, state: T) => {
			updateAllModalsState(state);
		},
		[updateAllModalsState]
	);

	const contextValue = React.useMemo(
		() => ({
			showModal,
			hideModal,
			updateState,
		}),
		[showModal, hideModal, updateState]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && modalsRef.current.size > 0) {
				const lastModalId = Array.from(modalsRef.current.keys()).pop();
				if (lastModalId) hideModal(lastModalId);
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hideModal]);

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
			<AnimatePresence>
				{modals.map((modal, index) => (
					<ModalContent
						key={modal.id}
						modal={modal}
						onClose={() => hideModal(modal.id)}
						zIndex={1000 + index}
						activeModalState={activeState}
					/>
				))}
			</AnimatePresence>
		</ModalContext.Provider>
	);
});

export default ModalProvider;
