"use client";

import React, {
	createContext,
	useState,
	useCallback,
	useContext,
	useEffect,
	ReactNode,
	ComponentProps,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { cn } from "./../../lib/utilities";
import Button from "./Button";
import Text from "./Text";

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

type ModalProps = {
	isVisible: boolean;
	onPrimaryAction?: () => void;
	onClose?: () => void;
	onSecondaryAction?: () => void;
	onToggle?: (isOpen: boolean) => void;
	title?: string;
	intent?: Intent;
	primaryLabel?: string;
	secondaryLabel?: string;
	size?: "sm" | "default" | "lg" | "xl";
	content?: ReactNode | ((...args: any[]) => ReactNode);
};

const MAP_VARIANT_CLASS: Record<Intent, string> = {
	default: "",
	primary: "bg-brand-subtle text-onBrand-subtle",
	info: "bg-info-subtle text-onInfo-subtle",
	success: "bg-success-subtle text-onSuccess-subtle",
	warning: "bg-warning-subtle text-onWarning-subtle",
	danger: "bg-danger-subtle text-onDanger-subtle",
	inverse: "bg-inverse-subtle text-onInverse-subtle",
};

const MAP_MODAL_WIDTH_CLASS: Record<"sm" | "default" | "lg" | "xl", string> = {
	sm: "max-w-sm",
	default: "max-w-xl",
	lg: "max-w-2xl",
	xl: "max-w-3xl",
};

const ModalContext = createContext<{
	showModal: (props: Partial<ModalProps>) => void;
	hideModal: () => void;
} | null>(null);

function ModalProvider({ children }: { children: ReactNode }) {
	const [isVisible, setIsVisible] = useState(false);
	const [modalProps, setModalProps] = useState<Partial<ModalProps>>({});

	const showModal = useCallback((props: Partial<ModalProps> = {}) => {
		setModalProps(props);
		setIsVisible(true);
	}, []);

	const hideModal = useCallback(() => {
		setIsVisible(false);
	}, []);

	return (
		<ModalContext.Provider value={{ showModal, hideModal }}>
			{children}
			<Modal {...modalProps} isVisible={isVisible} onClose={hideModal} />
		</ModalContext.Provider>
	);
}

export const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return context;
};

function Modal({
	isVisible,
	onPrimaryAction,
	onClose,
	onSecondaryAction,
	onToggle,
	title,
	intent = "default",
	primaryLabel,
	secondaryLabel,
	size = "default",
	content,
}: ModalProps) {
	const [currentContent, setCurrentContent] = useState<ReactNode | null>(null);

	useEffect(() => {
		if (typeof content === "function") {
			console.log("yeet");
			setCurrentContent(content());
		} else {
			console.log("yoot");
			setCurrentContent(content);
		}
	}, [content, isVisible]);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isVisible) onClose?.();
		};
		if (isVisible) document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isVisible, onClose]);

	useEffect(() => {
		onToggle?.(isVisible);
	}, [isVisible, onToggle]);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className="fixed inset-0 z-50 grid max-h-screen place-items-center overflow-y-auto bg-black bg-opacity-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
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
						onClick={(e) => e.stopPropagation()}
					>
						<div
							className={cn(
								"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
								"rounded-t-lg border-subtle border-b px-6",
								MAP_VARIANT_CLASS[intent]
							)}
						>
							<Text size="lead" weight="semibold">
								{title || "Modal Title"}
							</Text>
							<button type="button" className="modal-btn" onClick={onClose}>
								<IoCloseOutline />
							</button>
						</div>
						<div className="flex-1 p-6">{currentContent}</div>
						{(secondaryLabel || primaryLabel) && (
							<div className="flex h-[3.75rem] w-full justify-end gap-1 rounded-b-lg px-6">
								{secondaryLabel && (
									<Button
										variant="outline"
										className="capitalize"
										onClick={() => {
											onSecondaryAction?.();
											onClose?.();
										}}
									>
										{secondaryLabel}
									</Button>
								)}
								{primaryLabel && (
									<Button
										onClick={onPrimaryAction}
										variant="solid"
										intent={intent}
										className="capitalize "
									>
										{primaryLabel}
									</Button>
								)}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default ModalProvider;
