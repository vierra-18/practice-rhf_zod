// UIProvider.tsx
import React, { ReactNode } from "react";
import { AlertProvider } from "./Alert";
import PopupProvider from "./OverlayProvider";

interface UIProviderProps {
	children: ReactNode;
}

export function MultiverseProvider({ children }: UIProviderProps) {
	return (
		<>
			<AlertProvider maxAlerts={7}>
				<PopupProvider>{children}</PopupProvider>
			</AlertProvider>
		</>
	);
}
