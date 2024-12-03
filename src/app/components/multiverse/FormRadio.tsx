import {
	Children,
	type ComponentPropsWithoutRef,
	type ReactElement,
} from "react";

import { RadioGroup, RadioGroupItem } from "./RadioButton";

import { cn } from "./../../lib/utilities";

import FormFieldWrapper, {
	type Props as WrapperProps,
} from "./FormFieldWrapper";

type TRadioItem = typeof RadioItem;

type RadioItemType = {
	value: string;
} & Omit<
	ComponentPropsWithoutRef<typeof RadioGroupItem>,
	"onChange" | "checked"
>;

export function RadioItem(props: RadioItemType) {
	return null;
}

type Props = {
	value: string;
	onChange: (value: string) => void;
	label: string;
	children: Array<ReactElement<TRadioItem>> | ReactElement<TRadioItem>;
	containerClassName?: string;
} & WrapperProps;

function FormRadio({
	name,
	value,
	onChange,
	readOnly,
	label,
	error,
	children: raw,
	containerClassName,
	...rest
}: Props) {
	const children = Array.isArray(raw) ? raw : [raw];
	return (
		<FormFieldWrapper name={name} error={error} readOnly={readOnly} {...rest}>
			<RadioGroup
				className={cn("grid w-full gap-4 pt-4 pb-2", containerClassName)}
				onValueChange={(val) => onChange(val)}
				value={value}
			>
				{Children.toArray(
					children.map((c: ReactElement) => {
						const { value: cValue, label, ...rest } = c.props as RadioItemType;
						return (
							<RadioGroupItem
								key={cValue}
								label={label}
								value={cValue}
								{...rest}
							/>
						);
					})
				)}
			</RadioGroup>
		</FormFieldWrapper>
	);
}

export default FormRadio;
