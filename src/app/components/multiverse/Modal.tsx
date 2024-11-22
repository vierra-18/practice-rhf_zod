"use client";

import React, { ComponentProps } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

import { cn } from "@/app/lib/utilities";

import Text from "./Text";
import Button from "./Button";

const MAP_VARIANT_CLASS = {
	default: "",
	primary: "bg-brand-subtle text-onBrand-subtle",
	info: "bg-info-subtle text-onInfo-subtle",
	success: "bg-success-subtle text-onSuccess-subtle",
	warning: "bg-warning-subtle text-onWarning-subtle",
	danger: "bg-danger-subtle text-onDanger-subtle",
	inverse: "bg-inverse-subtle text-onInverse-subtle",
} as const;

const MAP_MODAL_WIDTH_CLASS = {
	sm: "max-w-sm",
	default: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
} as const;

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;
type Size = keyof typeof MAP_MODAL_WIDTH_CLASS;

type ModalProps = {
	onClose: () => void;
	title: string;
	intent?: Intent;
	size?: Size;
	primaryAction?: {
		label: string;
		onClick: () => void;
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
	};
	children: React.ReactNode;
};

export default function Modal({
	onClose,
	title,
	intent = "default",
	size = "default",
	primaryAction,
	secondaryAction,
	children,
}: ModalProps) {
	return (
		<motion.div
			className={cn(
				"relative my-10 rounded-lg border border-subtle bg-interface shadow-lg",
				"flex h-fit w-screen flex-col justify-between text",
				MAP_MODAL_WIDTH_CLASS[size]
			)}
			onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
		>
			<div
				className={cn(
					"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
					"rounded-t-lg border-b border-subtle px-6",
					MAP_VARIANT_CLASS[intent]
				)}
			>
				<Text size="lead" weight="semibold">
					{title}
				</Text>
				<button
					type="button"
					className="hover:shadow-button aspect-square rounded text-2xl duration-200 hover:bg-interface-hovered"
					onClick={onClose}
					aria-label="Close modal"
				>
					<IoCloseOutline />
				</button>
			</div>

			<div className="flex-1 p-6">{children}</div>

			{(primaryAction || secondaryAction) && (
				<div className="flex h-[3.75rem] w-full justify-end gap-1 rounded-b-lg px-6">
					{secondaryAction && (
						<Button
							variant="outline"
							className="capitalize"
							onClick={() => {
								secondaryAction.onClick();
								onClose();
							}}
						>
							{secondaryAction.label}
						</Button>
					)}
					{primaryAction && (
						<Button
							variant="solid"
							intent={intent}
							className="capitalize"
							onClick={primaryAction.onClick}
						>
							{primaryAction.label}
						</Button>
					)}
				</div>
			)}
		</motion.div>
	);
}
