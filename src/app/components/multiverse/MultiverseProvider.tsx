// UIProvider.tsx
import React, { ReactNode } from "react";
import { AlertProvider } from "./Alert";
import ModalProvider from "./ModalProvider";

interface UIProviderProps {
	children: ReactNode;
}

export function MultiverseProvider({ children }: UIProviderProps) {
	return (
		<>
			<AlertProvider maxAlerts={7}>
				<ModalProvider>{children}</ModalProvider>
			</AlertProvider>
		</>
	);
}
