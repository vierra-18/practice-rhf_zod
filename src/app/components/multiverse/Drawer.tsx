import type React from "react";
import { Fragment, useState } from "react";
import type { ReactNode } from "react";
import {
	Dialog,
	DialogPanel,
	TransitionChild,
	Transition,
} from "@headlessui/react";
import type { IconType } from "react-icons";
import { IoClose } from "react-icons/io5";
import Text from "./Text";
import Button from "./Button";
import Stack from "./Stack";
import { cn } from "@/app/lib/utilities";
const MAP_DRAWER_WIDTH_SIZE = {
	narrow: "w-48",
	medium: "w-64",
	wide: "w-80",
	extended: "w-96",
	fullWidth: "w-full",
};
type Intent =
	| "default"
	| "primary"
	| "info"
	| "warning"
	| "success"
	| "danger"
	| "inverse";
type BtnVariant = "solid" | "outline";
type BtnAction = {
	label: string;
	intent: Intent;
	variant: BtnVariant;
	onClick: () => void;
};
type DrawerProps = {
	children: ReactNode;
	position?: "left" | "right";
	className?: string;
	secondaryAction?: BtnAction;
	primaryAction?: BtnAction;
	title?: string;
	subTitle?: string;
	size?: keyof typeof MAP_DRAWER_WIDTH_SIZE;
	onCloseDrawer: () => void;
};
const Drawer: React.FC<DrawerProps> = ({
	children,
	title,
	subTitle,
	position = "left",
	className,
	secondaryAction,
	primaryAction,
	size = "wide",
	onCloseDrawer,
}) => {
	return (
		<div
			className={cn(
				"fixed inset-y-0 bg-white p-6 shadow-lg",
				position === "right" ? "right-0" : "left-0",
				MAP_DRAWER_WIDTH_SIZE[size],
				className
			)}
		>
			<Stack height="full">
				<Stack horizontal distribute="between" className="mb-4">
					<Stack>
						{title && (
							<Text size="heading" className="font-bold text-heading">
								{title}
							</Text>
						)}
						{subTitle && (
							<Text
								size="caption"
								className="text-nowrap text-[#6D7D96] text-xs capitalize"
							>
								{subTitle}
							</Text>
						)}
					</Stack>
					<button
						type="button"
						onClick={onCloseDrawer}
						className="focus:outline-none"
					>
						<IoClose />
					</button>
				</Stack>
				<Stack className="flex-1 overflow-y-auto">{children}</Stack>
				<Stack
					horizontal
					distribute="between"
					className="mt-4 flex-wrap"
					gap={8}
				>
					<Stack width="auto">
						{secondaryAction && (
							<Button
								onClick={secondaryAction.onClick}
								variant={secondaryAction.variant}
								size="default"
								className="w-auto capitalize"
								intent="default"
							>
								{secondaryAction.label}
							</Button>
						)}
					</Stack>
					<Stack className="flex-1">
						{primaryAction && (
							<Button
								onClick={primaryAction.onClick}
								variant={primaryAction.variant}
								size="default"
								className="w-full font-semibold capitalize"
								intent={primaryAction.intent}
							>
								{primaryAction.label}
							</Button>
						)}
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};
export default Drawer;
