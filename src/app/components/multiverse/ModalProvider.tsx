"use client";

import React, {
	createContext,
	useContext,
	useSyncExternalStore,
	type ReactNode,
} from "react";
import { isEqual } from "lodash";
import { Dialog, DialogPanel } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

type ModalProps<TState> = {
	state: TState;
	onClose: () => void;
};

export type ModalConfig<TState = unknown> = {
	component: React.ComponentType<ModalProps<TState>>;
};

type ModalInstance<TState = any> = {
	id: string;
	component: React.ComponentType<ModalProps<TState>>;
	state: TState;
};

type Listener = () => void;

type ModalContextType = {
	createModal: <TState>(config: ModalConfig<TState>, state: TState) => string;
	closeModal: (id: string) => void;
	updateState: <TState>(id: string, state: TState) => void;
};

class ModalStore {
	private modals = new Map<string, ModalInstance>();
	private listeners = new Set<Listener>();
	private isEmitting = false;
	private cachedSnapshot: ModalInstance[] | null = null;

	subscribe = (listener: Listener) => {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	};

	getSnapshot = () => {
		if (!this.cachedSnapshot) {
			this.cachedSnapshot = Array.from(this.modals.values());
		}
		return this.cachedSnapshot;
	};

	private emitChange() {
		if (this.isEmitting) return;

		this.isEmitting = true;
		try {
			this.cachedSnapshot = null;
			this.listeners.forEach((listener) => listener());
		} finally {
			this.isEmitting = false;
		}
	}

	createModal<TState>(
		config: ModalConfig<TState>,
		initialState: TState
	): string {
		const id = `modal-${Date.now()}`;
		const instance: ModalInstance<TState> = {
			id,
			component: config.component,
			state: initialState,
		};

		if (!this.modals.has(id)) {
			this.modals.set(id, instance);
			this.emitChange();
		}
		return id;
	}

	closeModal(id: string) {
		if (this.modals.has(id)) {
			this.modals.delete(id);
			this.emitChange();
		}
	}

	updateState<TState>(id: string, state: TState) {
		const modal = this.modals.get(id);
		if (modal && !isEqual(modal.state, state)) {
			this.modals.set(id, { ...modal, state });
			this.emitChange();
		}
	}
}

const store = new ModalStore();
const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error("useModalContext must be used within ModalProvider");
	}
	return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const modals = useSyncExternalStore(
		store.subscribe,
		store.getSnapshot, //csr
		store.getSnapshot //ssr
	);

	const modalContextValue = React.useMemo(
		() => ({
			createModal: <TState,>(config: ModalConfig<TState>, state: TState) =>
				store.createModal(config, state),
			closeModal: (id: string) => store.closeModal(id),
			updateState: <TState,>(id: string, state: TState) =>
				store.updateState(id, state),
		}),
		[]
	);

	return (
		<ModalContext.Provider value={modalContextValue}>
			{children}
			<AnimatePresence>
				{modals.map((modal, index) => {
					const ModalComponent = modal.component;
					return (
						<Dialog
							key={modal.id}
							open={true}
							onClose={() => modalContextValue.closeModal(modal.id)}
						>
							<motion.div
								key={modal.id}
								className="fixed inset-0 grid place-items-center bg-black/20"
								style={{ zIndex: 1000 + index }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<DialogPanel
									transition
									as={motion.div}
									initial={{ y: 10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: 10, opacity: 0 }}
								>
									<ModalComponent
										state={modal.state}
										onClose={() => modalContextValue.closeModal(modal.id)}
									/>
								</DialogPanel>
							</motion.div>
						</Dialog>
					);
				})}
			</AnimatePresence>
		</ModalContext.Provider>
	);
};

export default ModalProvider;
