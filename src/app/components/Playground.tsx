"use client";

import { useEffect, useState } from "react";
import { IoSave } from "react-icons/io5";
import { useAlert } from "./multiverse/Alert";
import Button from "./multiverse/Button";
import { useModal } from "./multiverse/Modal";

export default function Playground() {
	const { showModal } = useModal();

	const [counter, setCounter] = useState(0);

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCounter((prevCounter) => prevCounter + 1);
		}, 1000);

		return () => clearInterval(intervalId); // Clean up on unmount
	}, []);

	// useEffect(() => {
	// 	{
	// 		isModalOpen && handleOpenModal();
	// 	}
	// }, [counter, showModal]);

	const CounterDisplay: React.FC<{ counter: number }> = ({ counter }) => {
		return <div>Counter Value: {counter}</div>;
	};

	const handleOpenModal = () => {
		showModal({
			title: "Confirmation",
			content: () => <CounterDisplay counter={counter} />,
			size: "xl",
			intent: "danger",
			primaryLabel: "Confirm",
			secondaryLabel: "Cancel",
			onPrimaryAction: () => console.log("Confirmed!"),
			onToggle: (isOpen) => setIsModalOpen(isOpen), // Track modal open state
		});
	};
	const { addAlert } = useAlert();

	const handleTriggerDangerAlert = () => {
		addAlert({
			title: "Danger alert",
			body: "This is a danger alert",
			intent: "danger",
			actionLabel: "yeet",
			duration: 10_000,
		});
	};
	const handleTriggerSuccessAlert = () => {
		addAlert({
			title: "Success alert",
			body: "This is a success alert",
			intent: "success",
			duration: 10_000,
		});
	};
	const handleTriggerWarningAlert = () => {
		addAlert({
			title: "Warning alert",
			body: "This is a warning alert",
			intent: "warning",
		});
	};
	const handleTriggerAlert = () => {
		addAlert({
			title: "Default alert",
			body: "This is a default alert",
			duration: 10_000,
		});
	};
	return (
		<div className="relative flex flex-col flex-wrap gap-5 rounded p-5">
			{/* <>
				<Button
					type="button"
					className=" capitalize"
					onClick={handleTriggerDangerAlert}
					variant="solid"
					intent="danger"
				>
					danger alert
				</Button>
				<Button
					type="button"
					className=" capitalize"
					onClick={handleTriggerSuccessAlert}
					variant="solid"
					intent="success"
				>
					success alert
				</Button>
				<Button
					type="button"
					className=" capitalize"
					onClick={handleTriggerWarningAlert}
					variant="solid"
					intent="warning"
				>
					warning alert
				</Button>
				<Button
					type="button"
					className=" capitalize"
					onClick={handleTriggerAlert}
					variant="outline"
				>
					default alert
				</Button>
			</> */}
			<div className="font-extrabold text absolute right-5 top-5">
				counter: {counter}
			</div>
			<Button
				type="button"
				className=" capitalize"
				onClick={handleOpenModal}
				variant="solid"
				intent="info"
			>
				open modal through function
			</Button>
			<Button
				type="button"
				className=" capitalize"
				onClick={() => {
					showModal({
						title: "Confirmation",
						content: <CounterDisplay counter={counter} />,
						size: "xl",
						intent: "danger",
						primaryLabel: "Confirm",
						secondaryLabel: "Cancel",
						onPrimaryAction: () => console.log("Confirmed!"),
						onToggle: (isOpen) => setIsModalOpen(isOpen),
					});
				}}
				variant="solid"
				intent="info"
			>
				open modal through click
			</Button>
		</div>
	);
}
