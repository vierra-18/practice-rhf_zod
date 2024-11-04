import React, { ComponentProps, useEffect, type ReactElement } from "react";
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
	duration?: number;
	intent?: "default" | "danger" | "warning" | "success";
	hasTitle?: boolean;
	hasBody?: boolean;
	hasTimer?: boolean;
	hasTimestamp?: boolean;
	hasAction?: boolean;
	actionLabel?: string;
	onClick?: () => void;
	onClose: () => void;
};

// Extract the ButtonProps intent type using ComponentProps
type ButtonIntent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

// Mapping for intent and background based on alert intent

const MAP_INTENT: Record<ButtonIntent, string> = {
	default: "-brand",
	primary: "-primary",
	info: "-info",
	success: "-success",
	warning: "-warning",
	danger: "-danger",
	inverse: "-inverse",
};

// Timestamp component
function Timestamp() {
	const currentTime = new Date().toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
	return <p className="text-white-900">Today {currentTime}</p>;
}

export default function Alert({
	isActive = false,
	onClose,
	onClick,
	icon,
	title,
	body,
	duration = 10_000,
	intent = "default",
	hasTitle = true,
	hasBody = true,
	hasTimer = true,
	hasTimestamp = true,
	hasAction = true,
	actionLabel,
}: AlertProps) {
	const renderIcon = (Icon: Icon) => {
		if (React.isValidElement(Icon)) return Icon;
		if (typeof Icon === "function") return <Icon />;
		return null;
	};

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (isActive && hasTimer) {
			timer = setTimeout(() => {
				onClose();
			}, duration);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isActive, duration, hasTimer]);

	return (
		<motion.div
			initial={{ x: "100%", opacity: 0 }}
			animate={isActive ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
			transition={{ type: "spring", duration: 1, bounce: 0.25 }}
			className="alert-container"
			layout
		>
			<div className="alert-box">
				<div className="flex justify-between">
					<Button
						className="absolute top-1 right-2 border-none bg-transparent"
						onClick={onClose}
						variant="icon"
						icon={IoClose}
					/>
					<div
						className={cn(
							"flex items-start justify-center",
							"text" + MAP_INTENT[intent] || "text" + MAP_INTENT.default
						)}
					>
						{renderIcon(icon || RiInformationFill)}
					</div>
					<div className="flex flex-1 justify-between">
						<div className="flex flex-1 flex-col gap-y-2 px-4 text-xs ">
							{hasTitle && (
								<h1 className="font-bold capitalize">
									{title || "Notification Title"}
								</h1>
							)}
							{hasBody && (
								<p className="text-white-900">
									{body || "Brief feedback message"}
								</p>
							)}
							{hasTimestamp && <Timestamp />}
						</div>
						{hasAction && (
							<Button
								onClick={onClick}
								variant="solid"
								size="small"
								className="self-center justify-self-center capitalize mr-6"
								intent={intent} // Maps intent directly
							>
								{actionLabel || "Button"}
							</Button>
						)}
					</div>

					<span
						key={isActive && hasTimer ? "active" : "inactive"}
						style={
							{ "--animation-duration": `${duration}ms` } as React.CSSProperties
						}
						className={cn(
							"timer absolute bottom-0 left-0 h-1 w-full",
							"bg" + MAP_INTENT[intent] || "bg" + MAP_INTENT.default,
							isActive && hasTimer && "isAnimating"
						)}
					/>
				</div>
			</div>
		</motion.div>
	);
}
