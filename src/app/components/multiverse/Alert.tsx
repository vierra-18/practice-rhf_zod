import React, { useEffect, type ReactElement } from "react";
import type { IconType } from "react-icons";
import { RiInformationFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

import { motion } from "framer-motion";

import { cn } from "@/app/utilities/lib/utilities";

import Button from "./Button";

import "./Alert.css";
type Icon = IconType | ReactElement;

type AlertProps = {
	isActive?: boolean;
	icon?: Icon;
	title?: string;
	body?: string;
	duration?: number; //in milliseconds
	state?: "default" | "danger" | "warning" | "success";
	hasTitle?: boolean;
	hasBody?: boolean;
	hasTimer?: boolean;
	hasTimestamp?: boolean;
	hasAction?: boolean;
	actionLabel?: string;
	onClick?: () => void;
	onClose: () => void;
};
export default function Alert({
	isActive = false,
	onClose,
	onClick,
	icon,
	title,
	body,
	duration = 10_000,
	state = "default",
	hasTitle = true,
	hasBody = true,
	hasTimer = true,
	hasTimestamp = true,
	hasAction = true,
	actionLabel,
}: AlertProps) {
	const renderIcon = (Icon: Icon) => {
		if (React.isValidElement(Icon)) {
			return Icon;
		}
		if (typeof Icon === "function") {
			return <Icon />;
		}
		return null;
	};

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (isActive && hasTimer) {
			timer = setTimeout(() => {
				onClose(); // Close the alert after duration
			}, duration);
		}

		// Cleanup function to clear the timeout
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isActive, duration, onClose, hasTimer]);

	const currentTime = new Date().toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<motion.dialog
			initial={{ x: "100%", opacity: 0 }}
			animate={isActive ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
			transition={{ type: "spring", duration: 1, bounce: 0.25 }}
			className="alert"
		>
			<div className="alert-box ">
				<div className=" flex justify-between">
					<Button
						className="absolute top-1 right-2 border-none bg-transparent"
						onClick={onClose}
						variant="icon"
						icon={IoClose}
					/>
					<div
						className={cn(
							"flex items-start justify-center",
							state === "danger"
								? "text-danger"
								: state === "warning"
								? "text-warning"
								: state === "success"
								? "text-success"
								: "text-brand"
						)}
					>
						{renderIcon(icon || RiInformationFill)}
					</div>
					<div className="flex flex-1 flex-col gap-y-2 px-4 text-xs">
						{hasTitle && (
							<h1 className="font-bold capitalize">
								{title || "notification title"}
							</h1>
						)}
						{hasBody && (
							<p className="text-white-900">
								{body ||
									"This should be a brief copy to convey system feedback"}
							</p>
						)}
						{hasTimestamp && (
							<p className="text-white-900">Today {currentTime.slice(0)}</p>
						)}
					</div>
					{hasAction && (
						<Button
							onClick={onClick}
							variant="solid"
							size="small"
							className="self-center justify-self-center capitalize"
							intent={
								state === "danger"
									? "danger"
									: state === "warning"
									? "warning"
									: state === "success"
									? "success"
									: "primary"
							}
						>
							{actionLabel || "button"}
						</Button>
					)}
					<span
						key={isActive && hasTimer ? "active" : "inactive"}
						style={
							{ "--animation-duration": `${duration}ms` } as React.CSSProperties
						}
						className={cn(
							"timer absolute bottom-0 left-0 h-1 w-full",
							state === "danger"
								? "bg-danger"
								: state === "warning"
								? "bg-warning"
								: state === "success"
								? "bg-success"
								: "bg-brand",
							isActive && hasTimer && "isAnimating"
						)}
					/>
				</div>
			</div>
		</motion.dialog>
	);
}
