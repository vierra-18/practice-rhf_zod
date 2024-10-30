import { type ComponentPropsWithoutRef, useMemo } from "react";
import { type IconType } from "react-icons";

import { cn } from "../../utilities/lib/utilities";

import FormFieldWrapper from "./FormFieldWrapper";

type Props = {
	testId?: string;
	icon?: IconType;
	value: string;
	disabled?: boolean;
	maxLength?: number;
	placeholder?: string;
	type?: "text" | "email";
	onChange: (value: string) => void;
} & Omit<ComponentPropsWithoutRef<typeof FormFieldWrapper>, "children">;

function FormInput({
	name,
	value,
	label,
	error,
	icon: Icon,
	type = "text",
	noError = false,
	optional = false,
	disabled = false,
	readOnly = false,
	testId = undefined,
	maxLength = undefined,
	placeholder = undefined,
	errorDescription = undefined,
	onChange,
}: Props) {
	const hasIcon = useMemo(() => Boolean(Icon), [Icon]);
	return (
		<FormFieldWrapper
			name={name}
			error={error}
			label={label}
			noError={noError}
			readOnly={readOnly}
			optional={optional && !readOnly}
			errorDescription={errorDescription}
		>
			<div className="relative w-full">
				{Icon ? (
					<Icon
						className={cn(
							"-translate-y-1/2 absolute top-1/2 left-[0.625rem] h-[0.875rem] w-[0.875rem] text-subtle",
							disabled ? "text-disabled" : "",
							error ? "text-onDanger-subtle" : ""
						)}
					/>
				) : null}
				<input
					id={name}
					type={type}
					data-test-id={testId}
					value={value}
					className={cn(
						"w-full rounded border bg-white p-[0.625rem] text-sm leading-4 text placeholder:text-placeholder",
						"focus:outline-none disabled:bg-interface-disabled ",
						"[&:not(:disabled)]:read-only:border-none [&:not(:disabled)]:read-only:bg-transparent [&:not(:disabled)]:read-only:px-0 [&:not(:disabled)]:read-only:pt-1.5 ",
						hasIcon ? "pl-[1.6rem]" : "",
						error
							? "border-danger-subtle bg-danger-subtle text-onDanger-subtle"
							: "focus:border-selected"
					)}
					onChange={(e) => {
						const { value } = e.target;
						if (typeof onChange === "function") onChange(value);
					}}
					placeholder={readOnly ? "-" : placeholder}
					disabled={readOnly ? false : disabled}
					readOnly={readOnly}
					maxLength={maxLength}
				/>
			</div>
		</FormFieldWrapper>
	);
}

export default FormInput;
