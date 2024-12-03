import React from "react";
import { cn } from "@/app/lib/utilities";
import FormFieldWrapper, {
	type Props as WrapperProps,
} from "./FormFieldWrapper";
import { ChoiceGroup, ChoiceItem } from "./ChoiceButton";

type TChoiceItem = typeof ChoiceItem;

type ChoiceItemType = {
	value: string;
} & Omit<
	React.ComponentPropsWithoutRef<typeof ChoiceItem>,
	"onChange" | "checked"
>;

type Props = {
	value: string | string[];
	onChange: (value: string | string[]) => void;
	label: string;
	multiple?: boolean;
	children:
		| Array<React.ReactElement<TChoiceItem>>
		| React.ReactElement<TChoiceItem>;
	containerClassName?: string;
} & WrapperProps;

function FormChoice({
	name,
	value,
	onChange,
	readOnly,
	label,
	error,
	children: raw,
	containerClassName,
	multiple = false,
	...rest
}: Props) {
	const children = Array.isArray(raw) ? raw : [raw];

	const handleChange = (newValue: string | string[]) => {
		if (!multiple) {
			onChange(newValue as string);
			return;
		}

		// Handle multiple selection
		const currentValues = Array.isArray(value) ? value : [];
		if (typeof newValue === "string") {
			const updatedValues = currentValues.includes(newValue)
				? currentValues.filter((v) => v !== newValue)
				: [...currentValues, newValue];
			onChange(updatedValues);
		}
	};

	return (
		<FormFieldWrapper name={name} error={error} readOnly={readOnly} {...rest}>
			<ChoiceGroup
				className={cn("grid w-full gap-4", containerClassName)}
				onValueChange={handleChange}
				value={value}
				multiple={multiple}
			>
				{React.Children.toArray(
					children.map((c: React.ReactElement) => {
						const {
							value: cValue,
							label,
							description,
							...rest
						} = c.props as ChoiceItemType;
						return (
							<ChoiceItem
								key={cValue}
								label={label}
								value={cValue}
								description={description}
								multiple={multiple}
								isSelected={
									Array.isArray(value)
										? value.includes(cValue)
										: value === cValue
								}
								onSelect={multiple ? handleChange : undefined}
								{...rest}
							/>
						);
					})
				)}
			</ChoiceGroup>
		</FormFieldWrapper>
	);
}

export default FormChoice;
