"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "./multiverse/Button";
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { cn } from "../lib/utilities";
import MessageBox from "./multiverse/MessageBox";
import Modal from "./multiverse/Modal";
import { useCreateModal } from "./multiverse/ModalProvider";

type SimpleModalProps = {
	onClose: () => void;
	children: React.ReactNode;
};

function SimpleModal({ onClose, children }: SimpleModalProps) {
	return (
		<motion.div
			className={cn(
				"relative my-10 rounded-lg border border-subtle bg-interface shadow-lg",
				"flex h-fit w-screen flex-col justify-between text max-w-lg"
			)}
			onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
		>
			<div
				className={cn(
					"flex h-[4.25rem] max-h-[4.25rem] w-full items-center justify-between",
					"rounded-t-lg border-b border-subtle px-6 show-guide-3 "
				)}
			>
				<button
					type="button"
					className="hover:shadow-button aspect-square rounded text-2xl duration-200 hover:bg-interface-hovered"
					onClick={onClose}
					aria-label="Close modal"
				>
					<IoCloseOutline />
				</button>
			</div>

			<div className="flex-1 p-6">{children}</div>
		</motion.div>
	);
}

function getRandomWord() {
	const words = [
		"Phoenix",
		"Galaxy",
		"Nimbus",
		"Echo",
		"Zephyr",
		"Luna",
		"Sola",
		"Blaze",
		"Aurora",
		"Nova",
		"Starlight",
	];
	const index = Math.floor(Math.random() * words.length);
	return { word: words[index], index };
}

function PlaygroundContent() {
	const [data, setData] = useState({ id: 0, name: "Phoenix", counter: 0 });

	useEffect(() => {
		const counterInterval = setInterval(() => {
			setData((prev) => ({ ...prev, counter: prev.counter + 1 }));
		}, 1000);

		const nameInterval = setInterval(() => {
			const { word, index } = getRandomWord();
			setData((prev) => ({ ...prev, name: word, id: index }));
		}, 5000);

		return () => {
			clearInterval(counterInterval);
			clearInterval(nameInterval);
		};
	}, []);

	const createModal = useCreateModal(data);

	const openSecondModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<Modal
					onClose={onClose}
					title="Second Modal"
					intent="success"
					size="sm"
					primaryAction={{
						label: `Open Modal 3 (${state.counter})`,
						onClick: openThirdModal,
					}}
				>
					<div className="text-lg flex flex-col gap-y-5">
						Nested Counter Value: {state.counter}
					</div>
				</Modal>
			),
		});
	}, [createModal]);

	const openModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<Modal
					onClose={onClose}
					title={`Modal 1 - ${state.name}`}
					intent="danger"
					size="3xl"
					primaryAction={{
						label: `Open Modal 2 (${state.counter})`,
						onClick: openSecondModal,
					}}
				>
					ID: {state.id}, Name: {state.name}, Counter value: {state.counter}
				</Modal>
			),
		});
	}, [createModal, openSecondModal]);
	const openThirdModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<div className="text size-96 bg-interface grid place-items-center">
					counter: {state.counter}
					<button
						className="bg-black/20 rounded-md border p-4"
						onClick={onClose}
					>
						close
					</button>{" "}
					<button
						className="bg-black/20 rounded-md border p-4"
						onClick={openSecondModal}
					>
						open second modal
					</button>
				</div>
			),
		});
	}, [createModal, openSecondModal]);

	return (
		<div className="space-y-4">
			<div className="text font-extrabold">
				{data.name} (ID: {data.id}) Counter: {data.counter}
			</div>
			<Button variant="solid" intent="primary" onClick={openModal}>
				Open Modal Number 1
			</Button>
			<Button variant="solid" intent="success" onClick={openSecondModal}>
				Open Modal Number 2
			</Button>
			<Button variant="solid" intent="success" onClick={openThirdModal}>
				Open Modal Number 3
			</Button>
		</div>
	);
}

// Main Playground component wrapped with ModalProvider
export default function Playground() {
	return <PlaygroundContent />;
}
