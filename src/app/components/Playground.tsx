"use client";
import { useState } from "react";
import { z } from "zod";

import FormChoice from "./multiverse/FormChoice";
import { ChoiceGroup, ChoiceItem } from "./multiverse/ChoiceButton";
import { HiCreditCard } from "react-icons/hi";
import { FaCreditCard, FaRegCreditCard } from "react-icons/fa";
import { RiCoinLine, RiPaypalLine } from "react-icons/ri";
import Text from "./multiverse/Text";
import { RadioGroup, RadioGroupItem } from "./multiverse/RadioButton";
import Checkbox from "./multiverse/Checkbox";

// Zod schemas
const paymentSchema = z.object({
	payment: z.enum(["credit", "debit", "paypal", "crypto"]),
});

const notificationsSchema = z.object({
	notifications: z.array(z.enum(["email", "sms", "push", "whatsapp"])),
});

function PlaygroundContent() {
	// Single selection state
	const [selectedPayment, setSelectedPayment] = useState<string>("");

	// Multiple selection state for notifications
	const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
		[]
	);

	// Error state
	const [errors, setErrors] = useState<{
		payment?: string;
		notifications?: string;
	}>({});

	// Example data for payment methods
	const paymentMethods = [
		{
			value: "credit",
			label: "Credit Card",
			description: "Pay with Visa, Mastercard, or American Express",
			icon: <HiCreditCard />,
		},
		{
			value: "debit",
			label: "Debit Card",
			description: "Direct payment from your bank account",
			icon: <FaRegCreditCard />,
		},
		{
			value: "paypal",
			label: "PayPal",
			description: "Pay using your PayPal account",
			icon: <RiPaypalLine />,
		},
		{
			value: "crypto",
			label: "Cryptocurrency",
			description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
			icon: <RiCoinLine />,
		},
	];

	// Example data for notification preferences
	const notificationPreferences = [
		{
			value: "email",
			label: "Email",
			description: "Receive notifications via email",
			icon: <HiCreditCard />,
		},
		{
			value: "sms",
			label: "SMS",
			description: "Receive notifications via SMS",
			icon: <FaCreditCard />,
		},
		{
			value: "push",
			label: "Push Notifications",
			description: "Receive push notifications",
			icon: <RiPaypalLine />,
		},
		{
			value: "whatsapp",
			label: "WhatsApp",
			description: "Receive notifications via WhatsApp",
			icon: <RiCoinLine />,
		},
	];

	// Handle form submission
	const handleSubmit = () => {
		// Reset errors
		setErrors({});

		// Validate payment method
		const paymentValidation = paymentSchema.safeParse({
			payment: selectedPayment,
		});
		const notificationsValidation = notificationsSchema.safeParse({
			notifications: selectedNotifications,
		});

		let isValid = true;

		if (!paymentValidation.success) {
			setErrors((prev) => ({
				...prev,
				payment: "Invalid payment method selected.",
			}));
			isValid = false;
		}

		if (!notificationsValidation.success) {
			setErrors((prev) => ({
				...prev,
				notifications: "Invalid notification preferences selected.",
			}));
			isValid = false;
		}

		if (isValid) {
			alert("Form submitted successfully!");
		}
	};

	// Handling Checkbox change
	const handleCheckboxChange = (value: string, checked: boolean) => {
		if (checked) {
			setSelectedNotifications([...selectedNotifications, value]);
		} else {
			setSelectedNotifications(
				selectedNotifications.filter((v) => v !== value)
			);
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			{/* Single selection */}
			<div>
				<h2 className="mb-4 font-semibold text-xl">Select Payment Method</h2>
				<RadioGroup
					value={selectedPayment}
					onValueChange={(value) => setSelectedPayment(value as string)}
				>
					{paymentMethods.map((method) => (
						<RadioGroupItem
							key={method.value}
							label={method.label}
							value={method.value}
							description={method.description}
							icon={method.icon}
						/>
					))}
				</RadioGroup>

				{errors.payment && (
					<p className="mt-2 text-red-500">{errors.payment}</p>
				)}

				<div className="mt-4 rounded bg-gray-100 p-4">
					<p>
						Selected payment method: <strong>{selectedPayment}</strong>
					</p>
				</div>
			</div>

			{/* Multiple Selection for notifications */}
			<div>
				<h2 className="mb-4 font-semibold text-xl">
					Choose Notification Preferences
				</h2>
				<div className="space-y-2">
					{notificationPreferences.map((notification) => (
						<Checkbox
							key={notification.value}
							label={notification.label}
							checked={selectedNotifications.includes(notification.value)}
							onChange={(checked) =>
								handleCheckboxChange(notification.value, checked)
							}
							description={notification.description}
							icon={notification.icon}
						/>
					))}
				</div>

				{errors.notifications && (
					<p className="mt-2 text-red-500">{errors.notifications}</p>
				)}

				<div className="mt-4 rounded bg-gray-100 p-4">
					<p>Selected notification methods:</p>
					<ul className="mt-2 ml-4 list-disc">
						{selectedNotifications.map((method) => (
							<li key={method}>{method}</li>
						))}
					</ul>
				</div>
			</div>

			{/* Submit Button */}
			<button
				type="button"
				className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
				onClick={handleSubmit}
			>
				Submit
			</button>

			<Text>normal</Text>
			<Text size="caption">caption default</Text>
			<Text intent="danger" as="h1" size="title">
				caption subtle{" "}
				<Text as="a" href="/" target="_blank" rel="noreferrer">
					yeet
				</Text>
			</Text>
		</div>
	);
}

export default function Playground() {
	return <PlaygroundContent />;
}
