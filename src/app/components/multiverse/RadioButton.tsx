import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { FaCircle as Circle } from "react-icons/fa";

import { cn } from "./../../utilities/lib/utilities";

import Text from "./Text";

import "./RadioButton.css";
import { HiHashtag } from "react-icons/hi";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-4", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

type RadioButtonProps = {
	label: string;
	value: string;
	description?: string;
	contained?: boolean;
	disabled?: boolean;
	isChoice?: boolean;
};

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	RadioButtonProps
>(
	(
		{
			label,
			value,
			description,
			contained = false,
			disabled = false,
			isChoice = false,
		},
		ref
	) => {
		return (
			<div
				className={cn(
					"radio-item-root flex",
					description ? "items-start" : "items-center",
					contained
						? "min-w-[20.5625rem] gap-x-[0.5rem] rounded border p-[1rem]"
						: "gap-x-[0.75rem]"
				)}
			>
				<RadioGroupPrimitive.Item
					ref={ref}
					className={cn(
						"aspect-square border bg-surface-raised",
						"focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"data-[state=checked]:border-info-subtle data-[state=checked]:bg-interface-selected-subtle data-[state=checked]:text-onSelected-subtle",
						isChoice ? "size-9 rounded-md" : "size-4 rounded-full"
					)}
					value={value}
					disabled={disabled}
				>
					<RadioGroupPrimitive.Indicator className="flex items-center justify-center">
						{isChoice ? (
							<HiHashtag className="text size-4" />
						) : (
							<Circle className="h-2 w-2 fill-current text-current" />
						)}{" "}
					</RadioGroupPrimitive.Indicator>
				</RadioGroupPrimitive.Item>
				<div className="space-y-px">
					<Text as="p" size="body">
						{label}
					</Text>
					{description ? (
						<p className="text-caption-tight text-subtle">{description}</p>
					) : null}
				</div>
			</div>
		);
	}
);
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
