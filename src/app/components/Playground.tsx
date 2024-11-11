"use client";

import { useState } from "react";
import { IoSave } from "react-icons/io5";
import { useAlert } from "./multiverse/Alert";
import Button from "./multiverse/Button";
import Modal from "./multiverse/Modal";

export default function Playground() {
	const [isModalVisible, setModalVisible] = useState(false);

	const { addAlert } = useAlert();

	const handleTriggerDangerAlert = () => {
		addAlert({
			title: "Danger alert",
			body: "This is a danger alert",
			intent: "danger",
			actionLabel: "yeet",
			duration: 1_000_000,
		});
	};
	const handleTriggerSuccessAlert = () => {
		addAlert({
			title: "Success alert",
			body: "This is a success alert",
			intent: "success",
			duration: 1_000_000,
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
			duration: 1_000_000,
		});
	};
	return (
		<div className="flex flex-col flex-wrap gap-5 rounded p-5">
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
			<Button
				type="button"
				className=" capitalize"
				onClick={() => setModalVisible(true)}
				variant="solid"
				intent="info"
			>
				open modal
			</Button>
			<Modal
				isVisible={isModalVisible}
				onClose={() => setModalVisible(false)}
				// title="Modal Title"
				intent="success"
				size="exlarge"
			>
				<div className="flex flex-col gap-5">
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. In, fugiat
						praesentium iste enim rerum iusto. Laborum beatae alias laudantium
						pariatur facilis ipsam dicta deleniti voluptas quod veniam quasi at
						sequi quae ea tenetur earum eius assumenda, quis accusantium cum
						nesciunt ratione? Provident fuga obcaecati ullam eveniet suscipit
						quae porro quo!
					</p>{" "}
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. In, fugiat
						praesentium iste enim rerum iusto. Laborum beatae alias laudantium
						pariatur facilis ipsam dicta deleniti voluptas quod veniam quasi at
						sequi quae ea tenetur earum eius assumenda, quis accusantium cum
						nesciunt ratione? Provident fuga obcaecati ullam eveniet suscipit
						quae porro quo!
					</p>
				</div>
			</Modal>
		</div>
	);
}
