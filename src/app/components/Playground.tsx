"use client";
import { useCallback, useEffect, useState } from "react";
import Button from "./multiverse/Button";

import { MdOutlineBarChart, MdOutlineMultilineChart } from "react-icons/md";
import { RiInformationFill } from "react-icons/ri";
import Modal from "./multiverse/Modal";
import Note from "./multiverse/Note";
import StatCard from "./multiverse/StatCard";

import {
	AreaChart,
	Area,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import useCreateOverlay from "./multiverse/useCreateOverlay";
import Drawer from "./multiverse/Drawer";
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
	const createModal = useCreateOverlay({ data });
	const showModal = useCreateOverlay({});
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
			component: ({ close, state }) => (
				<Modal
					onClose={close}
					title="Second Modal"
					intent="success"
					size="sm"
					primaryAction={{
						label: `Open Modal 3 (${state.data.counter})`,
						onClick: () => {
							openThirdModal();
							close();
						},
						// close: true,
					}}
				>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam at,
						necessitatibus consequuntur odit quod reprehenderit placeat
						repudiandae inventore dignissimos provident.
					</p>
					<p>
						Quos quaerat culpa possimus aliquid atque assumenda aperiam velit
						delectus, eius iure repellendus! Fugit perspiciatis assumenda sequi
						modi eligendi deserunt?
					</p>
					<p>
						Neque beatae ipsam optio accusantium similique, at quas veniam.
						Deserunt tenetur aperiam consectetur ex molestias! Quos fugiat
						laboriosam repellat inventore!
					</p>
					<p>
						Iste, placeat pariatur provident aspernatur nostrum culpa deserunt
						officia voluptatem repellendus labore qui dolores esse sapiente
						cupiditate eligendi porro non?
					</p>
					<p>
						Nihil, rerum voluptate odio maxime quos provident deleniti enim
						nulla ut totam iste ea cupiditate laboriosam voluptatibus labore ex
						at!
					</p>
					<p>
						Tempora nobis vel sapiente ut voluptates ullam dignissimos itaque
						magnam animi consequatur, odit unde voluptatum commodi officiis
						recusandae voluptatem eligendi!
					</p>
					<p>
						Reprehenderit assumenda quae, unde nulla amet eaque quas dolorum
						nobis repellat voluptate eligendi? Quibusdam atque explicabo dicta
						inventore quod facilis!
					</p>
					<p>
						Necessitatibus, totam placeat fugiat corporis beatae unde tempore,
						ipsa porro consequuntur ab quis ad provident in dolorum, voluptatem
						nisi quia!
					</p>
					<p>
						Atque laudantium magni ex esse natus numquam dolorem, vitae nulla
						eligendi unde tenetur in velit consequatur aliquam ab! Quibusdam,
						necessitatibus.
					</p>
					<p>
						Enim consequatur quo labore aliquam recusandae, dicta nisi excepturi
						fugiat incidunt. Mollitia totam ea officiis id, perferendis sint
						consequuntur harum!
					</p>
				</Modal>
			),
		});
	}, [createModal]);

	/**
	 * First modal - demonstrates dynamic title and content updates
	 */
	const openModal = () => {
		createModal({
			position: "left",
			component: ({ close, state }) => (
				<Modal
					onClose={close}
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
	};

	/**
	 * Third modal - demonstrates custom styling and multiple actions
	 */
	const openThirdModal = () => {
		showModal({
			component: () => (
				<Drawer
					title="Title" // optional
					subTitle="subtitle" // optional
					secondaryAction={{
						label: "Button",
						intent: "default",
						variant: "solid",
						onClick: () => console.log("Secondary Button Clicked"),
					}}
					primaryAction={{
						label: "Primary Button",
						intent: "primary",
						variant: "solid",
						onClick: () => console.log("Primary Button Clicked"),
					}}
					size="wide" // "narrow" | "medium" | "wide" | "extended" | "fullWidth"
					onCloseDrawer={close}
				>
					<div className="flex flex-col gap-2">
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
					</div>
				</Drawer>
			),
			position: "right",
		});
	};
	const openLeftDrawer = () => {
		showModal({
			component: () => (
				<Drawer
					title="Title" // optional
					subTitle="subtitle" // optional
					secondaryAction={{
						label: "Button",
						intent: "default",
						variant: "solid",
						onClick: () => console.log("Secondary Button Clicked"),
					}}
					primaryAction={{
						label: "Primary Button",
						intent: "primary",
						variant: "solid",
						onClick: () => console.log("Primary Button Clicked"),
					}}
					size="wide" // "narrow" | "medium" | "wide" | "extended" | "fullWidth"
					onCloseDrawer={close}
				>
					<div className="flex flex-col gap-2">
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
						<Button>Sample Button</Button>
					</div>
				</Drawer>
			),
			position: "left",
		});
	};

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
				Open right drawer
			</Button>
			<Button variant="solid" intent="success" onClick={openLeftDrawer}>
				Open left drawer
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
