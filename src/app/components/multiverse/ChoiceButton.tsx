import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React, { useMemo } from "react";
import { FaHashtag } from "react-icons/fa";
import { cn } from "@/app/lib/utilities";
import Text from "./Text";

type BaseRootProps = {
	multiple?: boolean;
	value: string | string[];
	onValueChange: (value: string | string[]) => void;
	className?: string;
} & Omit<
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
	"value" | "onValueChange"
>;

// Extracted common types for reuse
type CommonItemProps = {
	label: string;
	value: string;
	description?: string;
	disabled?: boolean;
};

type ChoiceItemProps = CommonItemProps & {
	multiple?: boolean;
	isSelected?: boolean;
	onSelect?: (value: string) => void;
};

// Memoized content component to reduce re-renders
const ItemContent = React.memo(
	({
		label,
		description,
		iconContainerClassNames,
	}: {
		label: string;
		description?: string;
		iconContainerClassNames: string;
	}) => (
		<>
			<div className={iconContainerClassNames}>
				<FaHashtag className="h-5 w-5" />
			</div>
			<div className="flex flex-col gap-1">
				<Text size="body" weight="medium" className="text-left">
					{label}
				</Text>
				{description && (
					<Text size="caption" className="!text-caption text-left text-subtle">
						{description}
					</Text>
				)}
			</div>
		</>
	)
);
ItemContent.displayName = "ItemContent";

const ChoiceGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	BaseRootProps
>(({ className, multiple = false, value, onValueChange, ...props }, ref) => {
	if (!multiple) {
		return (
			<RadioGroupPrimitive.Root
				ref={ref}
				className={cn("grid gap-4", className)}
				value={value as string}
				onValueChange={onValueChange as (value: string) => void}
				{...props}
			/>
		);
	}

	return (
		<div
			ref={ref as React.Ref<HTMLDivElement>}
			className={cn("grid gap-4", className)}
			{...props}
		/>
	);
});
ChoiceGroup.displayName = "ChoiceGroup";

const ChoiceItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	ChoiceItemProps
>(
	(
		{
			label,
			value,
			description,
			disabled = false,
			multiple = false,
			isSelected = false,
			onSelect,
		},
		ref
	) => {
		const commonClassNames = useMemo(
			() =>
				cn(
					"group flex w-full items-start gap-3 rounded-lg transition-colors",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interface-focus",
					"disabled:cursor-not-allowed disabled:opacity-50"
				),
			[]
		);

		const iconContainerClassNames = useMemo(
			() =>
				cn(
					"h-9 w-9 aspect-square shrink-0 grid place-items-center rounded-md bg-interface-subtle",
					"group-hover:text-brand",
					"group-data-[state=checked]:bg-brand group-data-[state=checked]:text-white",
					"transition-colors duration-300"
				),
			[]
		);

		const content = useMemo(
			() => (
				<ItemContent
					label={label}
					description={description}
					iconContainerClassNames={iconContainerClassNames}
				/>
			),
			[label, description, iconContainerClassNames]
		);

		if (!multiple) {
			return (
				<RadioGroupPrimitive.Item
					ref={ref}
					value={value}
					disabled={disabled}
					className={commonClassNames}
				>
					{content}
				</RadioGroupPrimitive.Item>
			);
		}

		return (
			<CheckboxPrimitive.Root
				ref={ref as React.Ref<HTMLButtonElement>}
				checked={isSelected}
				onCheckedChange={() => onSelect?.(value)}
				disabled={disabled}
				className={commonClassNames}
			>
				{content}
			</CheckboxPrimitive.Root>
		);
	}
);
ChoiceItem.displayName = "ChoiceItem";

export { ChoiceGroup, ChoiceItem };
