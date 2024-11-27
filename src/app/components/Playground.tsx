"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "./multiverse/Button";

import { div } from "framer-motion/client";
import { LuArrowDownLeft, LuArrowUpRight } from "react-icons/lu";
import { MdOutlineBarChart, MdOutlineMultilineChart } from "react-icons/md";
import { RiInformationFill } from "react-icons/ri";
import MessageBox from "./multiverse/MessageBox";
import Modal from "./multiverse/Modal";
import Note from "./multiverse/Note";
import useCreateModal from "./multiverse/useCreateModal";
import StatCard from "./multiverse/StatCard";

import {
	AreaChart,
	Area,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
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
 * Dummy data for the tiny line chart
 */
const chartData = [
	{ name: "Jan", value: 40 },
	{ name: "Feb", value: 30 },
	{ name: "Mar", value: 20 },
	{ name: "Apr", value: 27 },
	{ name: "May", value: 18 },
	{ name: "Jun", value: 23 },
	{ name: "Jul", value: 34 },
];

/**
 * Main playground content demonstrating modal functionality
 * Shows different ways to create and manage modals with dynamic content
 */
function PlaygroundContent() {
	// Main state for dynamic content updates
	const [data, setData] = useState({ id: 0, name: "Phoenix", counter: 0 });
	// Separate counter state (consider removing if not needed)
	// biome-ignore lint/correctness/noUnusedVariables: <explanation>
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
	const showModal = useCreateModal({});
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
					<div className="flex flex-col gap-y-5 text-lg">
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
					ID: {state.data.id}, Name: {state.data.name}, Counter value:
					{state.data.counter}
				</Modal>
			),
		});
	}, [createModal, openSecondModal]);

	/**
	 * Third modal - demonstrates custom styling and multiple actions
	 */
	const openThirdModal = useCallback(() => {
		showModal({
			component: ({ onClose }) => (
				<div
					// onClick={onClose}
					className="text flex flex-col gap-4 rounded border bg-neutral-50 p-20"
				>
					hello
					<button type="button" className="border p-4" onClick={onClose}>
						close me
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
			<div className="text flex flex-col gap-2">
				<span className="font-extrabold capitalize">default</span>
				<Note
					message="Lorem, ipsum dolor sit amet consectetur"
					title="TITLE"
					intent="default"
					icon={RiInformationFill}
					action={{
						label: "Action Button",
						onClick: () => {
							openModal();
						},
					}}
				/>
				<span className="font-extrabold capitalize">danger</span>
				<Note
					message="Lorem, ipsum dolor sit amet consectetur"
					title="TITLE"
					intent="danger"
					icon={RiInformationFill}
					action={{
						label: "Action Button",
						onClick: () => {
							openModal();
						},
					}}
				/>
				<span className="font-extrabold capitalize">success</span>
				<Note
					message="Lorem, ipsum dolor sit amet consectetur"
					title="TITLE"
					intent="success"
					icon={RiInformationFill}
					action={{
						label: "Action Button",
						onClick: () => {
							openModal();
						},
					}}
				/>
				<span className="font-extrabold capitalize">warning</span>
				<Note
					message="Lorem, ipsum dolor sit amet consectetur"
					title="TITLE"
					intent="warning"
					icon={RiInformationFill}
					action={{
						label: "Action Button",
						onClick: () => {
							openModal();
						},
					}}
				/>
				<span className="font-extrabold capitalize">info</span>
				<Note
					message="Lorem, ipsum dolor sit amet consectetur"
					title="TITLE"
					intent="info"
					icon={RiInformationFill}
					action={{
						label: "Action Button",
						onClick: () => {
							openModal();
						},
					}}
				/>
			</div>

			<div className="text flex flex-col gap-3 py-10">
				<StatCard
					title="Stat Card Title"
					icon={MdOutlineBarChart}
					data={`${data.counter}`}
					badge={{ label: "70%", intent: "success", trend: "up" }}
					action={{ label: "Action", onClick: () => {} }}
				/>
				<StatCard
					title="Stat Card Title"
					icon={MdOutlineBarChart}
					data={`${data.counter}`}
				/>
				<StatCard title="Stat Card Title" data={`${data.counter}`} />
				<StatCard
					title="Stat Card Title"
					icon={MdOutlineMultilineChart}
					data={`${data.counter}`}
					badge={{ label: "20%", intent: "danger", trend: "down" }}
					action={{ label: "Action", onClick: () => {} }}
				>
					<ResponsiveContainer width="100%" height={100}>
						<AreaChart data={chartData}>
							<XAxis dataKey="name" hide />
							<YAxis hide />
							<Tooltip />
							<Area
								type="monotone"
								dataKey="value"
								stroke="#8884d8"
								fill="#8884d8"
								strokeWidth={2}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</StatCard>
			</div>
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
