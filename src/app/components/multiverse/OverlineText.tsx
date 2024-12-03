import type React from 'react';
import type { ComponentProps } from 'react';

import { cn } from './../../lib/utilities';

import Text from './Text';
import Tooltip from './Tooltip';

type TooltipProps = ComponentProps<typeof Tooltip>;

type OverlineTextProps = {
  children: React.ReactNode;
  title: string;
  tooltip?: TooltipProps;
  className?: string;
};

export default function OverlineText({
  children,
  title,
  tooltip,
  className,
}: OverlineTextProps) {
  return (
    <div className={cn('inline-flex flex-col gap-1 text', className)}>
      <div className="inline-flex items-center gap-1 text-subtle">
        <Text size="caption" weight="bold" className="uppercase">
          {title}
        </Text>
        {tooltip && <Tooltip {...tooltip}>{tooltip.children}</Tooltip>}
      </div>
      <div>{children}</div>
    </div>
  );
}
