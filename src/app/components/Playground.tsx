"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "./multiverse/Button";
import { useShowModal } from "./multiverse/Modal";

function getRandomWord() {
	const words = [
		"Phoenix",
		"Galaxy",
		"Nimbus",
		"Echo",
		"Zephyr",
		"Luna",
		"Blaze",
		"Aurora",
		"Nova",
		"Starlight",
	];
	const index = Math.floor(Math.random() * words.length);
	return { word: words[index], index };
}

export default function Playground() {
	const [data, setData] = useState({ id: 0, name: "Phoenix", counter: 0 });
	const showModal = useShowModal({ data });

	useEffect(() => {
		// Update counter every second
		const counterInterval = setInterval(() => {
			setData((prev) => ({ ...prev, counter: prev.counter + 1 }));
		}, 1000);

		// Update name and id every 5 seconds
		const nameInterval = setInterval(() => {
			const { word, index } = getRandomWord();
			setData((prev) => ({ ...prev, name: word, id: index }));
		}, 5000);

		return () => {
			clearInterval(counterInterval);
			clearInterval(nameInterval);
		};
	}, []);

	const openSecondModal = useCallback(() => {
		showModal({
			title: "Second Modal",
			content: (data) => (
				<div className="text-lg">Nested Counter Value: {data.data.counter}</div>
			),
			intent: "success",
			size: "sm",
		});
	}, [showModal]);

	const openFirstModal = useCallback(() => {
		showModal({
			title: (state) => `Modal 1 - ${state.data.name}`,
			intent: "danger",
			size: "3xl",
			content: (state) =>
				`ID: ${state.data.id}, Name: ${state.data.name}, Counter value: ${state.data.counter}`,
			primaryAction: {
				label: (state) => `Open Modal 2 (${state.data.counter})`,
				onClick: () => openSecondModal(),
			},
		});
	}, [showModal]);

	return (
		<div className="space-y-4">
			<div className="text font-extrabold">
				{data.name} (ID: {data.id}) Counter: {data.counter}
			</div>
			<Button variant="solid" intent="primary" onClick={openFirstModal}>
				Open Modal Number 1
			</Button>
			<Button variant="solid" intent="success" onClick={openSecondModal}>
				Open Modal Number 2
			</Button>
		</div>
	);
}
