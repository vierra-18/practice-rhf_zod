"use client";
import { useState } from "react";

import FormChoice from "./multiverse/FormChoice";
import { ChoiceItem } from "./multiverse/ChoiceButton";

function PlaygroundContent() {
	// Single selection state
	const [selectedPayment, setSelectedPayment] = useState<string>("credit");

	// Multiple selection state
	const [selectedNotifications, setSelectedNotifications] = useState<string[]>([
		"email",
	]);

	const paymentMethods = [
		{
			value: "credit",
			label: "Credit Card",
			description: "Pay with Visa, Mastercard, or American Express",
		},
		{
			value: "debit",
			label: "Debit Card",
			description: "Direct payment from your bank account",
		},
		{
			value: "paypal",
			label: "PayPal",
			description: "Pay using your PayPal account",
		},
		{
			value: "crypto",
			label: "Cryptocurrency",
			description: "Pay with Bitcoin, Ethereum, or other cryptocurrencies",
		},
	];

	const notificationPreferences = [
		{
			value: "email",
			label: "Email Notifications",
			description: "Receive updates in your inbox",
		},
		{
			value: "sms",
			label: "SMS Notifications",
			description: "Get text messages on your phone",
		},
		{
			value: "push",
			label: "Push Notifications",
			description: "Receive notifications in your browser",
		},
		{
			value: "whatsapp",
			label: "WhatsApp",
			description: "Get messages via WhatsApp",
		},
	];

	return (
		<div className="space-y-4">
			<div className="text my-5 flex gap-3 py-5">
				{/* // Single selection (original behavior) */}
				<div>
					<h2 className="mb-4 font-semibold text-xl">Select Payment Method</h2>
					<FormChoice
						label="Payment Method"
						value={selectedPayment}
						onChange={(value) => setSelectedPayment(value as string)}
						name="payment"
					>
						{paymentMethods.map((method) => (
							<ChoiceItem
								key={method.value}
								value={method.value}
								label={method.label}
								description={method.description}
							/>
						))}
					</FormChoice>
					<div className="mt-4 rounded bg-gray-100 p-4">
						<p>
							Selected payment method: <strong>{selectedPayment}</strong>
						</p>
					</div>
				</div>

				{/* Multiple Selection Example */}
				<div>
					<h2 className="mb-4 font-semibold text-xl">
						Choose Notification Preferences
					</h2>
					<FormChoice
						label="Notification Methods"
						value={selectedNotifications}
						onChange={(value) => setSelectedNotifications(value as string[])}
						name="notifications"
						multiple
					>
						{notificationPreferences.map((notification) => (
							<ChoiceItem
								key={notification.value}
								value={notification.value}
								label={notification.label}
								description={notification.description}
							/>
						))}
					</FormChoice>
					<div className="mt-4 rounded bg-gray-100 p-4">
						<p>Selected notification methods:</p>
						<ul className="mt-2 ml-4 list-disc">
							{selectedNotifications.map((method) => (
								<li key={method}>{method}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Playground() {
	return <PlaygroundContent />;
}
