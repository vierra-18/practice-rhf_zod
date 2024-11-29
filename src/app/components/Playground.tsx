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
import StatCard from "./multiverse/StatCard";

import {
	AreaChart,
	Area,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import ModalProvider, { useShowModal } from "./multiverse/test/Modal";
import useCreatePopup from "./multiverse/useCreatePopup";
import PopupProvider from "./multiverse/PopupProvider";
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
	const createModal = useCreatePopup({ data });
	const showModal = useCreatePopup({});
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
					stuff goes
				</Modal>
			),
		});
	}, [createModal]);

	/**
	 * First modal - demonstrates dynamic title and content updates
	 */
	const openModal = () => {
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
	};

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
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
					repellendus, eveniet est quaerat beatae ipsum dolores quod doloremque,
					reprehenderit corporis quidem cumque recusandae illum optio
					praesentium sed? Ullam, esse nam velit reiciendis dignissimos dolores,
					fugiat quisquam placeat minima sunt, voluptate adipisci exercitationem
					perspiciatis? Natus nobis quia veniam, iste minus architecto. Animi
					doloremque nam ipsum dolores itaque quo officia consequuntur dolore
					corrupti voluptatem, magnam, quod tempore asperiores repellat deleniti
					odit earum quam repellendus ad quos nemo eaque eveniet quasi culpa.
					Laudantium laboriosam sed cumque, nobis, quisquam vel voluptatum
					numquam rem asperiores dolores, temporibus exercitationem aperiam
					natus repudiandae itaque. Hic, nam ab? Modi ratione placeat architecto
					iure corporis esse quibusdam omnis labore eos. Amet hic, recusandae
					quod nam fuga commodi nostrum dolor totam praesentium asperiores
					mollitia! Veniam obcaecati laborum perspiciatis incidunt perferendis
					architecto vitae illum, cumque ullam eaque mollitia accusantium, rem
					temporibus inventore optio velit commodi fuga unde nemo iste quibusdam
					officia. Ducimus qui ratione repellendus quaerat quis id, maiores
					error fugiat voluptas iusto sapiente, odit necessitatibus eum nihil?
					Autem labore sed unde doloribus nostrum blanditiis libero commodi
					nulla atque ullam, nesciunt et porro. Deleniti iusto quam itaque
					accusamus distinctio? Vero culpa itaque deserunt doloribus fuga ipsum
					distinctio, molestiae autem non minus. In tenetur provident quas vel
					maiores ratione animi assumenda, blanditiis ab ea rem? Unde fugiat
					aperiam tempore commodi non! Quod fuga accusamus facilis vero nostrum
					necessitatibus sequi voluptate deserunt dolorem earum! Laborum
					quisquam dolores distinctio? Atque, voluptatem tempora esse culpa odio
					voluptate aut itaque a, quibusdam similique modi, animi natus. Nulla
					illum laborum enim quo at deleniti quisquam nobis tempora blanditiis,
					voluptatum, ipsum quas, ex soluta voluptate ut minus error odio
					eveniet autem laboriosam. Numquam ut mollitia aut voluptatibus.
					Explicabo itaque omnis voluptate natus numquam dicta vitae recusandae
					repellendus mollitia sed suscipit veniam, ut optio modi ex illum
					distinctio delectus! Quibusdam nulla pariatur maiores nostrum
					distinctio, saepe magni animi, voluptatem quo voluptate architecto
					quaerat eaque porro praesentium ad quod facilis. Esse dolores rerum
					soluta, quis blanditiis, eos optio ex laudantium autem itaque commodi
					repudiandae pariatur temporibus deleniti, dolor nisi amet eligendi
					velit nihil porro obcaecati iste! Quas, eaque. Animi, sint! Aliquam
					doloribus accusantium ipsam totam aliquid delectus. Odit, quibusdam
					laborum quae, vel voluptas rerum corrupti corporis velit atque itaque
					nobis reprehenderit non consectetur architecto inventore dignissimos
					repudiandae quia animi quis consequuntur dicta laudantium repellendus!
					Accusantium, iure. Sit, impedit dolores voluptatum et mollitia nobis
					sunt, quae amet nesciunt atque facilis incidunt? Architecto nam, non
					error nostrum ea a sapiente assumenda harum culpa officia vero,
					suscipit mollitia earum! Modi autem tempora inventore, sapiente
					distinctio facilis perspiciatis quasi, veniam soluta accusamus ratione
					perferendis laborum incidunt cumque, optio est temporibus tempore
					laboriosam! Rerum dolores, cum illum obcaecati possimus laboriosam
					blanditiis tempore enim esse quaerat. Repudiandae in ducimus quidem
					aliquam impedit voluptatum odit quibusdam vitae aut, id tempore qui
					maiores suscipit esse non. Et aspernatur facilis voluptatum, ullam
					earum atque illum. Culpa laborum fuga, magnam eos saepe officiis quasi
					delectus quibusdam perferendis provident blanditiis odio! Quo possimus
					rerum reprehenderit ipsum. Impedit tempore distinctio dolorum nam!
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
	return (
		<ModalProvider>
			<PlaygroundContent />
		</ModalProvider>
	);
}
