"use client";

import { AnimatePresence, motion } from "framer-motion"; // Animation library for modal transitions
import { isEqual } from "lodash"; // Utility for deep comparison of objects
import type React from "react";
import {
	type ComponentProps,
	type ReactNode,
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { IoCloseOutline } from "react-icons/io5"; // Icon for modal close button
import { cn } from "./../../lib/utilities"; // Utility for conditional class names
import Button from "./Button";
import Text from "./Text";

// import "./Modal.css";

// Type definitions for modal intent (visual style) and size
type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;
type Size = "sm" | "default" | "lg" | "xl" | "2xl" | "3xl";

// Represents the state of the modal
interface ModalState<T = unknown> {
	isVisible: boolean; // whether the modal is visible
	content: ((state: T) => React.ReactNode) | null; // content function for rendering
	modalProps: Omit<ModalProps, "isVisible" | "children">; // additional modal properties
}

// Describes properties for the modal component
interface ModalProps {
	isVisible: boolean;
	onPrimaryAction?: () => void; // handler for primary button action
	onClose?: () => void; // handler to close the modal
	onSecondaryAction?: () => void; // handler for secondary button action
	onToggle?: (isOpen: boolean) => void; // handler for toggle state changes
	title?: string; // modal title
	intent?: Intent; // style intent of the modal
	primaryLabel?: string; // label for the primary button
	secondaryLabel?: string; // label for the secondary button
	size?: Size; // size of the modal
	children?: React.ReactNode; // child nodes of the modal
}

// CSS classes mapped to modal intents for styling
const MAP_VARIANT_CLASS: Readonly<Record<Intent, string>> = {
	default: "",
	primary: "bg-brand-subtle text-onBrand-subtle",
	info: "bg-info-subtle text-onInfo-subtle",
	success: "bg-success-subtle text-onSuccess-subtle",
	warning: "bg-warning-subtle text-onWarning-subtle",
	danger: "bg-danger-subtle text-onDanger-subtle",
	inverse: "bg-inverse-subtle text-onInverse-subtle",
} as const;

// CSS classes mapped to modal sizes for styling
const MAP_MODAL_WIDTH_CLASS: Readonly<Record<Size, string>> = {
	sm: "max-w-sm",
	default: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
} as const;

// Options to configure the modal display
interface ShowModalOptions<T = unknown>
	extends Omit<ModalProps, "isVisible" | "children"> {
	content: (state: T) => React.ReactNode; // content rendering based on state
}

// Context type for managing modal display and state
interface ModalContextType {
	showModal: <T>(options: ShowModalOptions<T>) => void; // function to show modal
	hideModal: () => void; // function to hide modal
	setState: (state: Record<string, unknown>) => void; // function to set modal state
	state: Record<string, unknown>; // current state shared across modals
}

// Creates a context for the modal
const ModalContext = createContext<ModalContextType | null>(null);

// Props for ModalProvider component
interface ModalProviderProps {
	children: ReactNode; // child components that will use the modal context
}

// Provides the context for modal operations
function ModalProvider({ children }: ModalProviderProps): JSX.Element {
	// State for controlling modal visibility and content
	const [modalState, setModalState] = useState<ModalState>({
		isVisible: false, // initial visibility is false
		content: null, // no initial content
		modalProps: {}, // no additional properties initially
	});

	// General state for modals
	const [state, setState] = useState<Record<string, unknown>>({});

	// Function to display the modal with given content and properties
	const showModal = useCallback(
		<T,>({ content, ...modalProps }: ShowModalOptions<T>) => {
			setModalState({
				isVisible: true,
				content: content as (state: unknown) => React.ReactNode,
				modalProps,
			});
		},
		[]
	);

	// Function to hide the modal and reset state
	const hideModal = useCallback(() => {
		setModalState((prev) => ({
			...prev,
			isVisible: false,
		}));
	}, []);

	// Memoize the context value to optimize performance
	const contextValue = useMemo(
		() => ({
			showModal,
			hideModal,
			setState,
			state,
		}),
		[showModal, hideModal, state]
	);

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
			<Modal
				{...modalState.modalProps}
				isVisible={modalState.isVisible}
				onClose={hideModal}
			>
				{modalState.content?.(state)}
			</Modal>
		</ModalContext.Provider>
	);
}

// Custom hook to access modal context that throws an error if not used within the context
export const useModal = (): ModalContextType => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};

// Function to create a modal with a specified state
export function useShowModal<TState>(state?: TState) {
	const { showModal, setState } = useModal();
	const prevStateRef = useRef<TState | undefined>(state);

	useEffect(() => {
		// Update state only if it's different from the previous state
		if (!state) return;
		if (isEqual(prevStateRef.current, state)) return;

		prevStateRef.current = state;
		setState(state);
	}, [state, setState]);

	// Return a function to show the modal with the given options
	return useCallback(
		(options: ShowModalOptions<TState>) => {
			showModal(options);
		},
		[showModal]
	);
}

// Memoized modal content component
const ModalContent = memo(
	({
		children,
		title,
		intent = "default",
		onClose,
		primaryLabel,
		secondaryLabel,
		onPrimaryAction,
		onSecondaryAction,
		size = "default",
	}: Omit<ModalProps, "isVisible" | "onToggle">) => (
		<motion.div
			className={cn(
				"relative my-10 rounded-lg border border-subtle bg-interface shadow-lg",
				"text flex h-fit w-full flex-col justify-between",
				MAP_MODAL_WIDTH_CLASS[size]
			)}
			initial={{ y: 10 }}
			animate={{ y: 0 }}
			exit={{ y: 10 }}
			transition={{ type: "spring", duration: 0.3, bounce: 0.25 }}
			onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent event propagation to parent click handlers
		>
			<div
				className={cn(
					"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
					"rounded-t-lg border-subtle border-b px-6",
					MAP_VARIANT_CLASS[intent]
				)}
			>
				<Text size="lead" weight="semibold">
					{/* Display title or default text */}
					{title || "Modal Title"}
				</Text>
				<button
					type="button"
					className="text-2xl hover:shadow-button aspect-square hover:bg-interface-hovered rounded duration-200"
					onClick={onClose} // Call onClose when close button is clicked
					aria-label="Close modal" // Accessibility label
				>
					{/* Icon for closing modal */}
					<IoCloseOutline />
				</button>
			</div>
			{/* Space for modal content */}
			<div className="flex-1 p-6">{children}</div>
			{(secondaryLabel || primaryLabel) && (
				<div className="flex h-[3.75rem] w-full justify-end gap-1 rounded-b-lg px-6">
					{secondaryLabel && (
						<Button
							variant="outline"
							className="capitalize"
							onClick={() => {
								onSecondaryAction?.();
								onClose?.();
							}} // Execute secondary action and close modal
						>
							{/* Display secondary button label */}
							{secondaryLabel}
						</Button>
					)}
					{primaryLabel && (
						<Button
							onClick={onPrimaryAction} // Execute primary action
							variant="solid"
							intent={intent}
							className="capitalize"
						>
							{/* Display primary button label */}
							{primaryLabel}
						</Button>
					)}
				</div>
			)}
		</motion.div>
	)
);

// Main modal component that handles visibility and close actions
export function Modal({
	isVisible,
	onClose,
	onToggle,
	...props
}: ModalProps): JSX.Element {
	useEffect(() => {
		// Handle escape key press to close the modal
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isVisible) onClose?.();
		};

		if (isVisible) {
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
	}, [isVisible, onClose]);

	useEffect(() => {
		// Notify external components about the modal toggle state
		onToggle?.(isVisible);
	}, [isVisible, onToggle]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="fixed inset-0 z-50 grid max-h-screen place-items-center overflow-y-auto bg-black bg-opacity-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }} // Fade in animation
					exit={{ opacity: 0 }} // Fade out animation
					onClick={onClose} // Close modal on background click
				>
					{/* Render modal content */}
					<ModalContent {...props} onClose={onClose} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default memo(ModalProvider); // Memoize ModalProvider to prevent unnecessary re-renders
