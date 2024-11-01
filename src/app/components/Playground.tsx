"use client";

import { useAlert } from "./multiverse/AlertContext";

export default function Playground() {
	// const [isModalOpen, setIsModalOpen] = useState(false);
	const { addAlert } = useAlert();

	const handleTriggerDangerAlert = () => {
		addAlert({
			title: "",
			body: "",
			intent: "danger",
			// hasTimer: false,
			// hasBody: false,
			// hasTitle: false,
			// hasAction: false,
			duration: 5000,
			onClick: () => {},
		});
	};
	const handleTriggerSuccessAlert = () => {
		addAlert({
			title: "",
			body: "",
			intent: "success",
			// hasTimer: false,
			// hasBody: false,
			// hasTitle: false,
			// hasAction: false,
			duration: 5000,
			onClick: () => {},
		});
	};
	const handleTriggerWarningAlert = () => {
		addAlert({
			title: "",
			body: "",
			intent: "warning",
			// hasTimer: false,
			// hasBody: false,
			// hasTitle: false,
			// hasAction: false,
			duration: 5000,
			onClick: () => {},
		});
	};
	return (
		<div className="flex flex-wrap gap-5 rounded p-5">
			<button
				type="button"
				className="btn capitalize"
				onClick={handleTriggerDangerAlert}
			>
				danger alert
			</button>
			<button
				type="button"
				className="btn capitalize"
				onClick={handleTriggerSuccessAlert}
			>
				success alert
			</button>
			<button
				type="button"
				className="btn capitalize"
				onClick={handleTriggerWarningAlert}
			>
				warning alert
			</button>
			{/* <Alert
        title=""
        body=""
        state="danger"
        isActive={isModalOpen}
        actionLabel=""
        onClose={() => setIsModalOpen(false)}
        icon={RiInformationFill}
        onClick={() => {
          setIsModalOpen(false);
        }}
      /> */}
		</div>
	);
}
