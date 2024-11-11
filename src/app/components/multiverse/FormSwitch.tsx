import type { ComponentPropsWithoutRef } from "react";

import { cn } from "./../../utilities/lib/utilities";

import FormFieldWrapper from "./FormFieldWrapper";
import Text from "./Text";

import "./ToggleSwitch.css";

type Props<
	TOnValue = true,
	TOffValue = false,
	TValue = TOnValue | TOffValue
> = {
	value: TValue;
	onChange: (value: NoInfer<TValue>) => void;
	testId?: string;
	onValue?: TOnValue;
	offValue?: TOffValue;
	label?: string | ((value: NoInfer<TValue>) => string);
} & (
	| {
			label: string | ((value: NoInfer<TValue>) => string);
			description?: string | ((value: NoInfer<TValue>) => string);
			contained?: boolean;
			switchPosition?: "trailing" | "leading";
	  }
	| {
			// Omit properties only when label is not present
			label?: never;
			description?: never;
			contained?: never;
			switchPosition?: never;
	  }
) &
	Omit<ComponentPropsWithoutRef<typeof FormFieldWrapper>, "children" | "label">;

const FormSwitch = <const TOnValue, const TOffValue>({
	name,
	value,
	onChange,
	onValue: onV,
	offValue: offV,
	optional,
	readOnly,
	testId,
	label,
	description,
	contained = false,
	switchPosition = "leading",
	error,
	noError = false,
	errorDescription,
}: Props<TOnValue, TOffValue>) => {
	const onValue = onV ?? true;
	const offValue = offV ?? false;
	const isLeading = switchPosition === "leading";

	return (
		<FormFieldWrapper
			name={name}
			error={error}
			noError={noError}
			readOnly={readOnly}
			optional={optional && !readOnly}
			errorDescription={errorDescription}
		>
			<div
				className={cn(
					"flex items-center",
					label && "w-72 p-3",
					label && contained && "rounded border border-white-100 bg-interface",
					!isLeading && "flex-row-reverse justify-between"
				)}
			>
				<div className={cn("toggle-switch", isLeading && label && "mr-4")}>
					<input
						id={`id-${name}`}
						data-test-id={testId}
						type="checkbox"
						checked={value === onValue}
						// @ts-expect-error dynamic value
						onChange={(e) => onChange(e.target.checked ? onValue : offValue)}
					/>
					<label htmlFor={`id-${name}`} />
				</div>
				{label && (
					<div className="text flex flex-col gap-1">
						<Text className="font-bold capitalize">{label?.toString()}</Text>
						{description && (
							<Text className="opacity-70">
								{description?.toString() || ""}
							</Text>
						)}
					</div>
				)}
			</div>
		</FormFieldWrapper>
	);
};

export default FormSwitch;
