"use client";

import { useCallback, useEffect, useState } from "react";
import { IoSave } from "react-icons/io5";
// import useCreateModal from "./jerico/useCreateModal";
import { useAlert } from "./multiverse/Alert";
import Button from "./multiverse/Button";
import { useShowModal } from "./multiverse/Modal";

export default function Playground() {
	const [counter, setCounter] = useState(0);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const showModal = useShowModal({ counter });

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCounter((prevCounter) => prevCounter + 1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const CounterDisplayModalContent = ({ counter }: any) => (
		<div>Parent Counter Value: {counter}</div>
	);

	const openModalOne = useCallback(() => {
		showModal({
			title: `MODAL 1`,
			size: "3xl",
			intent: "danger",
			primaryLabel: "Confirm",
			onPrimaryAction: () => {
				openModalTwo();
			},

			secondaryLabel: "Cancel",
			content: (counter) => (
				<CounterDisplayModalContent counter={counter.counter} />
			),
		});
	}, [showModal]);
	const openModalTwo = useCallback(() => {
		showModal({
			title: `MODAL 2`,
			size: "xl",
			intent: "success",
			primaryLabel: "Confirm",
			secondaryLabel: "Cancel",
			content: (counter) => (
				<CounterDisplayModalContent counter={counter.counter} />
			),
		});
	}, [showModal]);

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
			<div className="text absolute top-5 right-5 font-extrabold">
				<CounterDisplayModalContent counter={counter} />
			</div>
			<Button
				type="button"
				className="capitalize"
				onClick={openModalOne}
				variant="solid"
				intent="info"
			>
				Open Modal Number 1
			</Button>{" "}
			<Button
				type="button"
				className="capitalize"
				onClick={openModalTwo}
				variant="solid"
				intent="info"
			>
				Open Modal Number 2
			</Button>
			<Button
				type="button"
				className="capitalize"
				onClick={() => {
					setIsModalOpen(true);
				}}
				variant="solid"
				intent="info"
			>
				Open Modal Through Click
			</Button>
		</div>
	);
}
