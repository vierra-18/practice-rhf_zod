"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, {
	useEffect,
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
	type ReactElement,
	type ReactNode,
	type ComponentProps,
} from "react";
import type { IconType } from "react-icons";
import { IoClose } from "react-icons/io5";
import { RiInformationFill } from "react-icons/ri";

import { cn } from "./../../lib/utilities";

import Button from "./Button";
import Text from "./Text";

import "./Alert.css";

type Icon = IconType | ReactElement;

type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

type AlertProps = {
	isActive?: boolean;
	icon?: Icon;
	title?: string;
	body?: string;
	duration?: number;
	intent?: Intent;
	hasTimestamp?: boolean;
	hasAction?: boolean;
	actionLabel?: string;
	onClick?: () => void;
	onClose?: () => void;
};

type AlertData = AlertProps & { id: number; isVisible?: boolean };

type AlertContextType = {
	addAlert: (alert: Omit<AlertData, "id">) => void;
	removeAlert: (id: number) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
	const context = useContext(AlertContext);
	if (!context)
		throw new Error("useAlert must be used within an AlertProvider");
	return context;
}

interface AlertProviderProps {
	children: ReactNode;
	maxAlerts?: number;
}

export function AlertProvider({ children, maxAlerts = 5 }: AlertProviderProps) {
	const [alerts, setAlerts] = useState<AlertData[]>([]);
	const [nextId, setNextId] = useState(1);
	const REMOVE_DELAY = 100;

	const addAlert = useCallback(
		(alert: Omit<AlertData, "id">) => {
			setAlerts((prevAlerts) => {
				const updatedAlerts = [...prevAlerts];
				const excessCount = updatedAlerts.length - maxAlerts + 1;

				if (excessCount > 0) {
					for (const oldAlert of updatedAlerts.slice(0, excessCount)) {
						oldAlert.isVisible = false;
						setTimeout(() => {
							setAlerts((alerts) => alerts.filter((a) => a.id !== oldAlert.id));
						}, REMOVE_DELAY);
					}
				}

				const newAlert = { ...alert, id: nextId, isVisible: true };
				return [...updatedAlerts, newAlert];
			});

			setNextId((prevId) => prevId + 1);
		},
		[maxAlerts, nextId, setAlerts]
	);

	const removeAlert = useCallback(
		(id: number) => {
			setAlerts((prevAlerts) =>
				prevAlerts.map((alert) =>
					alert.id === id ? { ...alert, isVisible: false } : alert
				)
			);
			setTimeout(() => {
				setAlerts((prevAlerts) =>
					prevAlerts.filter((alert) => alert.id !== id)
				);
			}, REMOVE_DELAY);
		},
		[setAlerts]
	);

	return (
		<AlertContext.Provider value={{ addAlert, removeAlert }}>
			{children}
			<AnimatePresence>
				<div className="alert-stack">
					{alerts.map((alert) => (
						<Alert
							key={alert.id}
							{...alert}
							isActive={alert.isVisible}
							onClose={() => {
								alert.onClose?.();
								removeAlert(alert.id);
							}}
						/>
					))}
				</div>
			</AnimatePresence>
		</AlertContext.Provider>
	);
}

const MAP_ICON_COLOR_CLASS: Record<Intent, string> = {
	default: "text-[--black-700]",
	primary: "text-brand",
	info: "text-info",
	success: "text-success",
	warning: "text-warning",
	danger: "text-danger",
	inverse: "text-inverse",
};

const MAP_SPAN_BG_COLOR_CLASS: Record<Intent, string> = {
	default: "bg-[--black-700]",
	primary: "bg-brand",
	info: "bg-info",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-danger",
	inverse: "bg-inverse",
};

function Timestamp() {
	const currentTime = new Date().toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
	return (
		<Text size="caption" lineHeight="tight" weight="normal">
			{`Today ${currentTime}`}
		</Text>
	);
}

export default function Alert({
	isActive = false,
	onClose,
	onClick,
	icon,
	title,
	body,
	duration,
	intent = "default",
	hasTimestamp = true,
	hasAction = true,
	actionLabel,
}: AlertProps) {
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	const renderIcon = (Icon: Icon) => {
		if (React.isValidElement(Icon)) return Icon;
		if (typeof Icon === "function") return <Icon />;
		return null;
	};

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (isActive && duration) {
			timer = setTimeout(() => {
				if (onCloseRef.current) {
					onCloseRef.current();
				}
			}, duration);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [isActive, duration]);

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
							MAP_ICON_COLOR_CLASS[intent]
						)}
					>
						{renderIcon(icon || RiInformationFill)}
					</div>
					<div className="flex flex-1 justify-between">
						<div className="flex flex-1 flex-col gap-y-2 px-4 text-xs">
							{title && (
								<Text size="caption" lineHeight="tight" weight="semibold">
									{title || "Notification Title"}
								</Text>
							)}
							{body && (
								<Text size="caption" lineHeight="tight" weight="normal">
									{body || "Brief feedback message"}
								</Text>
							)}
							{hasTimestamp && <Timestamp />}
						</div>
						{hasAction && (
							<Button
								onClick={onClick}
								variant={`${intent === "default" ? "outline" : "solid"}`}
								size="small"
								className="mr-6 self-center justify-self-center capitalize "
								intent={intent}
							>
								{actionLabel || "Button"}
							</Button>
						)}
					</div>

					<span
						key={isActive && duration ? "active" : "inactive"}
						style={
							{
								"--animation-duration": `${duration}ms`,
							} as React.CSSProperties
						}
						className={cn(
							"timer absolute bottom-0 left-0 h-1 w-full ",
							MAP_SPAN_BG_COLOR_CLASS[intent],
							isActive && duration && "isAnimating"
						)}
					/>
				</div>
			</div>
		</motion.div>
	);
}
