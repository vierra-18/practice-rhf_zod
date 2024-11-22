import React from "react";
import type { ComponentProps, ReactElement } from "react";
import {
	Dialog,
	DialogContent,
	DialogOverlay,
	type DialogProps,
	DialogTitle,
} from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { RiInformationFill } from "react-icons/ri";
import Text from "./Text";
import Button from "./Button";
import { cn } from "@/app/lib/utilities";
type Intent = Exclude<ComponentProps<typeof Button>["intent"], undefined>;
type Icon = IconType | ReactElement;
const TEXT_COLOR_CLASS: Record<Intent, string> = {
	default: "text-[--black-700]",
	primary: "text-brand",
	info: "text-info",
	success: "text-success",
	warning: "text-warning",
	danger: "text-danger",
	inverse: "text-inverse",
};
type MessageBoxProps = DialogProps & {
	title: string;
	message: string;
	confirmAction?: { label: string; onClick: () => void };
	closeAction?: { label: string; onClick: () => void };
	intent?: Intent;
	className?: string;
	type: "display" | "popup";
	icon?: Icon;
	onCloseMessageBox: () => void;
};
const MessageBox: React.FC<MessageBoxProps> = ({
	title,
	message,
	confirmAction,
	closeAction,
	intent = "default",
	type = "popup",
	icon,
	className,
	onCloseMessageBox,
	...props
}) => {
	const textColor = TEXT_COLOR_CLASS[intent];
	const renderIcon = (Icon: Icon) => {
		if (React.isValidElement(Icon)) {
			return Icon;
		}
		if (typeof Icon === "function") {
			return <Icon />;
		}
		return null;
	};
	return (
		<Dialog open={true} {...props}>
			<div
				className={cn(
					"rounded-md border border-gray-200 bg-white p-[24px]",
					type === "popup" && "max-w-xl shadow-lg",
					className
				)}
				aria-describedby={undefined}
			>
				<div className="flex flex-row gap-[16px]">
					<div className="mt-[2px] flex flex-col">
						{icon ? (
							<div className={cn("text-[20px]", textColor)}>
								{renderIcon(icon)}
							</div>
						) : (
							<RiInformationFill className={cn("text-[20px]", textColor)} />
						)}
					</div>
					<div className="flex flex-col items-start gap-[12px]">
						<DialogTitle
							className={cn(
								"m-0 p-0 text-body font-semibold",
								`${intent === "primary" ? "text-[--black-700]" : textColor}`
							)}
						>
							{title}
						</DialogTitle>
						<p className="text-left text-body font-normal text-[#6D7D96]">
							{message}
						</p>
						<div className="flex flex-wrap items-start gap-[8px]">
							{confirmAction && (
								<Button
									onClick={confirmAction?.onClick}
									variant={"solid"}
									size="default"
									className={cn(
										"text-body font-semibold capitalize text-[#FFF]"
									)}
									intent={intent}
								>
									{confirmAction?.label}
								</Button>
							)}
							{closeAction && (
								<Button
									onClick={() => {
										closeAction?.onClick();
										onCloseMessageBox();
									}}
									variant={"solid"}
									size="default"
									className="text-body capitalize"
									intent={"default"}
								>
									{closeAction?.label}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>
		</Dialog>
	);
};
export default MessageBox;
