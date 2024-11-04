"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	ReactElement,
} from "react";
import { IconType } from "react-icons";
import { RiInformationFill } from "react-icons/ri";
import Alert from "./Alert";

import "./Alert.css";
import { AnimatePresence } from "framer-motion";

type Icon = IconType | ReactElement;

type AlertData = {
	id: number;
	icon?: Icon;
	title?: string;
	body?: string;
	duration?: number; // in milliseconds
	intent?: "danger" | "warning" | "success";
	hasTitle?: boolean;
	hasBody?: boolean;
	hasTimer?: boolean;
	hasTimestamp?: boolean;
	hasAction?: boolean;
	actionLabel?: string;
	onClick?: () => void;
	isVisible?: boolean; // New property to track visibility
};

type AlertContextType = {
	addAlert: (alert: Omit<AlertData, "id">) => void;
	removeAlert: (id: number) => void; // Function to mark alert as inactive
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
	const REMOVE_DELAY = 500;

	const addAlert = (alert: Omit<AlertData, "id">) => {
		setAlerts((prevAlerts) => {
			const updatedAlerts = [...prevAlerts];

			// Identify excess alerts and mark them as not visible
			const excessCount = updatedAlerts.length - maxAlerts + 1;
			if (excessCount > 0) {
				// Mark the oldest `excessCount` alerts as `isVisible: false`
				updatedAlerts.slice(0, excessCount).forEach((oldAlert) => {
					oldAlert.isVisible = false;
					setTimeout(() => {
						setAlerts((alerts) => alerts.filter((a) => a.id !== oldAlert.id));
					}, REMOVE_DELAY);
				});
			}

			// Add the new alert with isVisible set to true
			const newAlert = { ...alert, id: nextId, isVisible: true };
			return [...updatedAlerts, newAlert];
		});

		setNextId((prevId) => prevId + 1);
	};

	const removeAlert = (id: number) => {
		// Step 1: Set the alert as inactive for animation
		setAlerts((prevAlerts) =>
			prevAlerts.map((alert) =>
				alert.id === id ? { ...alert, isVisible: false } : alert
			)
		);

		// Step 2: Schedule removal from the DOM
		setTimeout(() => {
			setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
		}, REMOVE_DELAY); // Ensure this matches the exit animation duration
	};

	return (
		<AlertContext.Provider value={{ addAlert, removeAlert }}>
			{children}
			<AnimatePresence>
				<div className="alert-stack">
					{alerts.map((alert) => (
						<Alert
							key={alert.id}
							icon={alert.icon}
							title={alert.title}
							body={alert.body}
							intent={alert.intent}
							duration={alert.duration}
							actionLabel={alert.actionLabel}
							hasTitle={alert.hasTitle}
							hasBody={alert.hasBody}
							hasTimer={alert.hasTimer}
							hasTimestamp={alert.hasTimestamp}
							hasAction={alert.hasAction}
							isActive={alert.isVisible}
							onClose={() => removeAlert(alert.id)}
							onClick={alert.onClick}
						/>
					))}
				</div>
			</AnimatePresence>
		</AlertContext.Provider>
	);
}
