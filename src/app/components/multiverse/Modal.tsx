import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import {
	type ComponentProps,
	type ReactElement,
	type ReactNode,
	useEffect,
} from "react";
import type { IconType } from "react-icons";
import { IoCloseOutline } from "react-icons/io5";

import { cn } from "./../../lib/utilities";

import Button from "./Button";
import Text from "./Text";

type Icon = IconType | ReactElement;

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

type ModalProps = {
	isVisible: boolean;
	onClick?: () => void;
	onClose?: () => void;
	onCancel?: () => void;
	title?: string;
	intent?: Intent;
	primaryLabel?: string;
	secondaryLabel?: string;
	icon?: Icon;
	size?: "small" | "default" | "large" | "exlarge";
	children?: ReactNode;
};

const MAP_TEXT_COLOR_CLASS: Record<Intent, string> = {
	default: "",
	primary: "text-onPrimary-subtle",
	info: "text-onInfo-subtle",

	success: "text-onSuccess-subtle",
	warning: "text-onWarning-subtle",
	danger: "text-onDanger-subtle",
	inverse: "text-onInverse-subtle",
};
const MAP_TITLE_BAR_BG_COLOR_CLASS: Record<Intent, string> = {
	default: "bg-brand-subtle",
	primary: "bg-primary-subtle",
	info: "bg-info-subtle",
	success: "bg-success-subtle",
	warning: "bg-warning-subtle",
	danger: "bg-danger-subtle",
	inverse: "bg-inverse-subtle",
};

const MAP_MODAL_WIDTH_CLASS: Record<
	"small" | "default" | "large" | "exlarge",
	string
> = {
	small: "max-w-sm",
	default: "max-w-xl",
	large: "max-w-2xl",
	exlarge: "max-w-3xl",
};

export default function Modal({
	isVisible,
	onClick,
	onClose,
	onCancel,
	title,
	intent = "default",
	primaryLabel,
	secondaryLabel,
	size = "default",

	children,
}: ModalProps) {
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isVisible) {
				onClose?.();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isVisible, onClose]);

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
							"max-w-xl",
							MAP_MODAL_WIDTH_CLASS[size]
						)}
						initial={{ y: -10 }}
						animate={{ y: 0 }}
						exit={{ y: -10 }}
						transition={{ type: "spring", duration: 1, bounce: 0.25 }}
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<div
							className={cn(
								"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
								"rounded-t-lg border-subtle border-b px-6",
								MAP_TITLE_BAR_BG_COLOR_CLASS[intent] ||
									MAP_TITLE_BAR_BG_COLOR_CLASS.default
							)}
						>
							<Text
								size="lead"
								weight="semibold"
								className={cn(
									MAP_TEXT_COLOR_CLASS[intent] || MAP_TEXT_COLOR_CLASS.default
								)}
							>
								{title || "Modal Title"}
							</Text>

							<button type="button" className="modal-btn" onClick={onClose}>
								<IoCloseOutline
									className={cn(
										MAP_TEXT_COLOR_CLASS[intent] || MAP_TEXT_COLOR_CLASS.default
									)}
								/>
							</button>
						</div>
						<div className="flex-1 p-6">{children}</div>
						{(secondaryLabel || primaryLabel) && (
							<div className=" flex h-[3.75rem] w-full justify-end gap-1 rounded-b-lg px-6">
								{secondaryLabel && (
									<Button
										variant="outline"
										className="capitalize"
										onClick={() => {
											onCancel?.();
											onClose?.();
										}}
									>
										{secondaryLabel}
									</Button>
								)}
								{primaryLabel && (
									<Button
										onClick={onClick}
										variant="solid"
										intent={intent}
										className="capitalize"
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

// type CommaNames = "jerico,robin,frenz,edmon"

// type Name =
