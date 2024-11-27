import React, { type ComponentProps, type ReactElement } from "react";
import type { IconType } from "react-icons";

import { cn } from "./../../lib/utilities";

import Button from "./Button";
import Text from "./Text";

type Icon = IconType | ReactElement;
type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;

const MAP_TEXT_COLOR_CLASS = {
	default: "",
	primary: "text-onBrand-subtle",
	info: "text-onInfo-subtle",
	success: "text-onSuccess-subtle",
	warning: "text-onWarning-subtle",
	danger: "text-onDanger-subtle",
	inverse: "text-onInverse-subtle",
} as const;
const MAP_ICON_COLOR_CLASS = {
	default: "",
	primary: "text-brand",
	info: "text-info",
	success: "text-success",
	warning: "text-warning",
	danger: "text-danger",
	inverse: "text-inverse",
} as const;

type NoteProps = {
	message: string;
	title?: string;
	icon?: Icon;
	intent?: Intent;
	action?: {
		label: string;
		onClick: () => void;
	};
};

export default function Note({
	message,
	title,
	icon,
	action,
	intent = "default",
}: NoteProps) {
	const renderIcon = (Icon: Icon) => {
		if (React.isValidElement(Icon)) return Icon;
		if (typeof Icon === "function") return <Icon />;
		return null;
	};

	return (
		<div
			className={cn(
				"border border-white-400 bg-interface-subtle",
				"text w-screen max-w-[25rem] rounded px-3 py-2",
				MAP_TEXT_COLOR_CLASS[intent]
			)}
		>
			<div className="relative flex items-center gap-2">
				{icon && (
					<span
						className={cn(
							"grid place-items-center",
							MAP_ICON_COLOR_CLASS[intent]
						)}
					>
						{renderIcon(icon)}
					</span>
				)}

				<div className="flex flex-1 items-center gap-2">
					{title && (
						<Text size="caption" weight="bold">
							{title}
						</Text>
					)}
					{message && (
						<Text size="caption" weight="medium" className="text">
							{message}
						</Text>
					)}
				</div>

				{action && (
					<Button
						size="small"
						variant={`${intent === "default" ? "outline" : "solid"}`}
						onClick={action.onClick}
						intent={intent}
					>
						{action.label}
					</Button>
				)}
			</div>
		</div>
	);
}
