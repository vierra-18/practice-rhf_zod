"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import type React from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

type PopupProps<TState> = {
	state: TState;
	close: () => void;
};

export type PopupConfig<TState = unknown> = {
	component: React.ComponentType<PopupProps<TState>>;
};

type PopupInstance<TState = any> = {
	id: string;
	component: React.ComponentType<PopupProps<TState>>;
	state: TState;
};

type PopupContextType = {
	createPopup: <TState>(config: PopupConfig<TState>, state: TState) => string;
	closePopup: (id: string) => void;
	updateState: <TState>(id: string, state: TState) => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export const usePopupContext = () => {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error("usePopupContext must be used within PopupProvider");
	}
	return context;
};

function areStatesEqual<TState>(prev: TState, next: TState): boolean {
	if (prev === next) return true;

	if (prev == null || next == null) return prev === next;

	if (Array.isArray(prev) && Array.isArray(next)) {
		if (prev.length !== next.length) return false;
		return prev.every((val, index) => areStatesEqual(val, next[index]));
	}

	if (typeof prev === "object" && typeof next === "object") {
		const prevKeys = Object.keys(prev);
		const nextKeys = Object.keys(next);

		if (prevKeys.length !== nextKeys.length) return false;

		return prevKeys.every(
			(key) =>
				nextKeys.includes(key) &&
				areStatesEqual((prev as any)[key], (next as any)[key])
		);
	}

	return prev === next;
}

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
	const popupsRef = useRef<Map<string, PopupInstance>>(new Map());
	const [popupsKey, setPopupsKey] = useState(0);

	const createPopup = useCallback(
		<TState,>(config: PopupConfig<TState>, state: TState): string => {
			const id = `popup-${Date.now()}-${crypto.randomUUID()}`;
			const instance: PopupInstance<TState> = {
				id,
				component: config.component,
				state,
			};

			popupsRef.current.set(id, instance);
			setPopupsKey((prev) => prev + 1);
			return id;
		},
		[]
	);

	const closePopup = useCallback((id: string) => {
		if (popupsRef.current.has(id)) {
			popupsRef.current.delete(id);
			setPopupsKey((prev) => prev + 1);
		}
	}, []);

	const updateState = useCallback(<TState,>(id: string, state: TState) => {
		const popup = popupsRef.current.get(id);
		if (popup && !areStatesEqual(popup.state, state)) {
			popupsRef.current.set(id, { ...popup, state });
			setPopupsKey((prev) => prev + 1);
		}
	}, []);

	const popupContextValue = useMemo(
		() => ({
			createPopup,
			closePopup,
			updateState,
		}),
		[createPopup, closePopup, updateState]
	);

	const popupList = useMemo(
		() => Array.from(popupsRef.current.values()),
		[popupsKey]
	);

	return (
		<PopupContext.Provider value={popupContextValue}>
			{children}
			<AnimatePresence>
				{popupList.map((popup, index) => {
					const PopupComponent = popup.component;
					return (
						<Dialog
							key={popup.id}
							open={true}
							onClose={() => popupContextValue.closePopup(popup.id)}
						>
							<motion.div
								className="fixed inset-0 grid place-items-center overflow-y-auto bg-black/50 py-10"
								style={{ zIndex: 1000 + index }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<DialogPanel>
									<motion.div
										initial={{ y: 10, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										exit={{ y: 10, opacity: 0 }}
										transition={{ type: "spring", duration: 0.3, bounce: 0.25 }}
									>
										<PopupComponent
											state={popup.state}
											close={() => popupContextValue.closePopup(popup.id)}
										/>
									</motion.div>
								</DialogPanel>
							</motion.div>
						</Dialog>
					);
				})}
			</AnimatePresence>
		</PopupContext.Provider>
	);
};

export default PopupProvider;
