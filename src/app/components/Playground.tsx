"use client";

import { useState } from "react";
import { useAlert } from "./multiverse/AlertContext";
import FormSwitch from "./multiverse/FormSwitch";

export default function Playground() {
	const [switchValue, setSwitchValue] = useState(false); // Initial value can be true or false

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
			title: "warning alert",
			body: "this is the body of the warning alert",
			intent: "warning",
			// hasTimer: false,
			hasTimestamp: false,
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
			<div className="w-full">
				<FormSwitch
					name="exampleSwitch" // Unique name for the switch
					value={switchValue} // Controlled value
					onChange={setSwitchValue} // Handler for value changes
					label="Toggle Feature" // Label displayed next to the switch
					// description="Enable or disable the feature." // Optional description
					contained // Optional prop for styling
					switchPosition="trailing"
				/>{" "}
			</div>
		</div>
	);
}
