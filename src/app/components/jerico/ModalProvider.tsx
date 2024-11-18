"use client";

import { cn } from "@/app/lib/utilities";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { FaTimes } from "react-icons/fa";

type ModalContextType = {
	setModals: (func: (prev: ModalType[]) => ModalType[]) => void;
	modals: ModalType[] | [];
	setStates: (func: (prev: Record<string, any>) => Record<string, any>) => void;
	states: Record<string, Record<string, any>>;
};

export const ModalContext = createContext<ModalContextType | null>(null);

type ModalType = {
	key: string;
	hookKey: string;
	title: string;
	status: "open" | "minimize";
	content: React.ReactNode | ((state: any) => React.ReactNode);
};

export const useModalContext = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) {
		throw new Error("useModal must be used within a ModalProvider");
	}
	return ctx;
};

const Modal = ({ modal, i }: { modal: ModalType; i: number }) => {
	const { states, setModals } = useModalContext();
	const [isTransformMinimize, setIsTransformMinimize] = useState(false);
	const { key, hookKey } = modal;

	const prevModalStateRef = useRef<any | null>(null);
	const modalState = useMemo(() => {
		if (states[hookKey] !== prevModalStateRef.current) {
			prevModalStateRef.current = states[hookKey];
		}
		return states[hookKey];
	}, [states, hookKey]);

	const handleMaximizeModal = () => {
		setIsTransformMinimize(false);
	};

	const handleTransitionEnd = (e: any) => {
		if (!Array.from(e.target.classList).includes("modal-minimize")) return;
		setIsTransformMinimize(true);
	};

	const closeModal =
		(key: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			setModals((prev) => prev.filter((modal) => modal.key !== key));
		};

	useEffect(() => {
		if (!isTransformMinimize) {
			setModals((prev) =>
				prev.map((modal) =>
					modal.key === key ? { ...modal, status: "open" } : modal
				)
			);
		}
	}, [isTransformMinimize, key, setModals]);

	return (
		<>
			<div
				className={cn(
					"bg-primary-700 relative isolate mr-1 flex cursor-pointer items-center rounded-t-lg border-l border-r border-t border-white bg-brand px-2 py-1 transition-all hover:bg-brand-hovered hover:pb-2",
					isTransformMinimize ? "" : "invisible"
				)}
			>
				<button
					type="button"
					aria-label="maximize"
					className="absolute inset-0 h-full w-full"
					onClick={handleMaximizeModal}
				/>
				<p className="whitespace-nowrap text-sm text-onBrand">{modal.title}</p>
				<button
					type="button"
					className="relative z-10 ml-2 cursor-pointer"
					onClick={closeModal(modal.key)}
				>
					<FaTimes className="text-white" />
				</button>
			</div>
			<div
				className={cn(
					"modal fixed inset-0 grid h-full w-full place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-100 ease-[cubic-bezier(0.47,1.64,0.41,0.8)]",
					modal?.status === "open" ? "" : "modal-minimize cursor-pointer",
					isTransformMinimize ? "hidden" : ""
				)}
				style={{
					zIndex: 9999,
					right: modal.status === "minimize" ? `${i * 4.875}rem` : "0",
				}}
				onTransitionEnd={handleTransitionEnd}
			>
				<div className="w-full p-4">
					{typeof modal.content === "function"
						? modal.content(modalState)
						: modal.content}
					{modal.status === "minimize" && (
						<div className="absolute h-full w-full" />
					)}
				</div>
			</div>
		</>
	);
};

const cssStyles = `
  .modal.modal-minimize {
    transform: scale(0.05);
    transform-origin: 100% 100%;
  }
`;

const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modals, setModals] = useState<ModalType[]>([]);
	const [states, setStates] = useState({});

	return (
		<ModalContext.Provider value={{ setModals, modals, setStates, states }}>
			<style>{cssStyles}</style>
			<div className="fixed bottom-0 right-0 z-50 flex max-w-full flex-row-reverse overflow-x-scroll">
				{modals.map((modal, i) => (
					<Modal key={modal.key} modal={modal} i={i} />
				))}
			</div>
			{children}
		</ModalContext.Provider>
	);
};

export default ModalProvider;
