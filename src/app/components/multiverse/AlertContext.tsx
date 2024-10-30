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

type Icon = IconType | ReactElement;

type AlertData = {
	id: number;
	icon?: Icon;
	title?: string;
	body?: string;
	duration?: number; // in milliseconds
	state?: "danger" | "warning" | "success";
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

export function AlertProvider({ children }: { children: ReactNode }) {
	const [alerts, setAlerts] = useState<AlertData[]>([]);
	const [nextId, setNextId] = useState(1);

	const addAlert = (alert: Omit<AlertData, "id">) => {
		const newAlert = { ...alert, id: nextId, isVisible: true }; // Set isVisible to true when adding
		setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
		setNextId((prevId) => prevId + 1);
	};

	const removeAlert = (id: number) => {
		// Instead of removing, we set isVisible to false
		setAlerts((prevAlerts) =>
			prevAlerts.map((alert) =>
				alert.id === id ? { ...alert, isVisible: false } : alert
			)
		);
	};

	return (
		<AlertContext.Provider value={{ addAlert, removeAlert }}>
			{children}
			<div className="alert-stack show-guide absolute w-screen h-screen">
				{alerts.map((alert) => (
					<Alert
						key={alert.id}
						icon={alert.icon}
						title={alert.title}
						body={alert.body}
						state={alert.state}
						duration={alert.duration}
						actionLabel={alert.actionLabel}
						hasTitle={alert.hasTitle}
						hasBody={alert.hasBody}
						hasTimer={alert.hasTimer}
						hasTimestamp={alert.hasTimestamp}
						hasAction={alert.hasAction}
						isActive={alert.isVisible} // Use isVisible to control animation
						onClose={() => removeAlert(alert.id)} // Keep the same remove function
						onClick={alert.onClick}
					/>
				))}
			</div>
		</AlertContext.Provider>
	);
}
