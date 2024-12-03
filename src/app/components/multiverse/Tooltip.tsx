import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { MdClose as Close } from "react-icons/md";

import Text from "./Text";
import { cn } from "./../../lib/utilities";

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		className={cn(
			"fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-[18.75rem] animate-in overflow-hidden rounded border-transparent bg-inverse px-4 pt-2 pb-4 text-onInverse transition-all data-[state=closed]:animate-out",
			className
		)}
		sideOffset={10}
		arrowPadding={15}
		{...props}
	>
		{children}
		<TooltipPrimitive.Arrow
			className="border-none fill-black-500"
			width={15}
			height={7}
		/>
	</TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TMainProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	position?: "top" | "right" | "bottom" | "left";
	offset?: "center" | "end" | "start";
	title?: React.ReactNode;
	dismissible?: boolean;
} & Omit<
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
	"content" | "title"
>;

const Tooltip = ({
	content,
	children,
	position = "bottom",
	offset = "center",
	title,
	dismissible,
	...props
}: TMainProps) => {
	const [open, setOpen] = React.useState(false);
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root delayDuration={300} {...(dismissible && { open })}>
				<TooltipPrimitive.Trigger
					{...(dismissible && { onClick: () => setOpen(!open) })}
				>
					{children}
				</TooltipPrimitive.Trigger>
				<TooltipContent side={position} align={offset} {...props}>
					<div className="flex flex-col gap-[0.5rem]">
						<div className="flex">
							<div className="flex-1">
								{typeof title === "string" ? (
									<Text size="caption" weight="semibold">
										{title}
									</Text>
								) : title ? (
									title
								) : null}
							</div>
							{dismissible && (
								<button type="button" onClick={() => setOpen(false)}>
									<Close />
								</button>
							)}
						</div>
						<div>{content}</div>
					</div>
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	);
};

export default Tooltip;
