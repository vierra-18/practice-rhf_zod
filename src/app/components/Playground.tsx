"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "./multiverse/Button";
import { IoCloseOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { cn } from "../lib/utilities";
import MessageBox from "./multiverse/MessageBox";
import Modal from "./multiverse/Modal";
import useCreateModal from "./multiverse/useCreateModal";
/**
 * Utility function to generate random word and index
 * Used for demonstration of dynamic modal content updates
 */
function getRandomWord() {
	const words = ["Phoenix", "Galaxy", "Nimbus" /* ... */];
	const index = Math.floor(Math.random() * words.length);
	return { word: words[index], index };
}

/**
 * Main playground content demonstrating modal functionality
 * Shows different ways to create and manage modals with dynamic content
 */
function PlaygroundContent() {
	// Main state for dynamic content updates
	const [data, setData] = useState({ id: 0, name: "Phoenix", counter: 0 });
	// Separate counter state (consider removing if not needed)
	const [counter, setCounter] = useState(0);

	/**
	 * Setup intervals for dynamic content updates
	 * - Counter updates every second
	 * - Name updates every 5 seconds
	 */
	useEffect(() => {
		// Update counter every second
		const counterInterval = setInterval(() => {
			setData((prev) => ({ ...prev, counter: prev.counter + 1 }));
		}, 1000);

		// Update name and ID every 5 seconds
		const nameInterval = setInterval(() => {
			const { word, index } = getRandomWord();
			setData((prev) => ({ ...prev, name: word, id: index }));
		}, 5000);

		// Cleanup intervals on component unmount
		return () => {
			clearInterval(counterInterval);
			clearInterval(nameInterval);
		};
	}, []);

	// Initialize modal creation with state to be observed
	// Any changes to this state will trigger updates in all active modals using the hook
	const createModal = useCreateModal({ data, counter });
	/**
	 - May observe unnecessary state changes
	 - Less granular control over what each modal observes
	 - Could lead to unnecessary re-renders if modals only need specific pieces of state
	*/
	// const showUserModal = useCreateModal({ user });
	// const showCounterModal = useCreateModal({ counter });
	// const showDataModal = useCreateModal({ data });
	/**
	- More precise control over what each modal observes
  - Better performance when states update independently
	- Clearer intent for each modal's purpose
	- Easier to debug which state changes affect which modals
	- Better code splitting potential
	*/

	/**
	 * Modal opening handlers
	 * Each handler creates a different type of modal with specific content and actions
	 */
	const openSecondModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<Modal
					onClose={onClose}
					title="Second Modal"
					intent="success"
					size="sm"
					primaryAction={{
						label: `Open Modal 3 (${state.data.counter})`,
						onClick: openThirdModal,
					}}
				>
					<div className="text-lg flex flex-col gap-y-5">
						{/* Access counter through state.data for consistency */}
						Nested Counter Value: {state.data.counter}
					</div>
				</Modal>
			),
		});
	}, [createModal]);

	/**
	 * First modal - demonstrates dynamic title and content updates
	 */
	const openModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<Modal
					onClose={onClose}
					title={`Modal 1 - ${state.data.name}`}
					intent="danger"
					size="3xl"
					primaryAction={{
						label: `Open Modal 2 (${state.data.counter})`,
						onClick: openSecondModal,
					}}
				>
					ID: {state.data.id}, Name: {state.data.name}, Counter value:{" "}
					{state.data.counter}
				</Modal>
			),
		});
	}, [createModal, openSecondModal]);

	/**
	 * Third modal - demonstrates custom styling and multiple actions
	 */
	const openThirdModal = useCallback(() => {
		createModal({
			component: ({ onClose, state }) => (
				<div className="text size-96 bg-interface grid place-items-center">
					counter: {state.data.counter}
					<button
						className="bg-black/20 rounded-md border p-4"
						onClick={onClose}
					>
						close
					</button>
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
			{/* Display current state values */}
			<div className="text font-extrabold">
				{data.name} (ID: {data.id}) Counter: {data.counter}
			</div>
			{/* Modal trigger buttons */}
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

/**
 * Main Playground component
 * Note: This component should be wrapped with ModalProvider in the parent component
 * Example:
 * <ModalProvider>
 *   <Playground />
 * </ModalProvider>
 */
export default function Playground() {
	return <PlaygroundContent />;
}
