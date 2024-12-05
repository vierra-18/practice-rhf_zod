import * as React from 'react';
import type { IconType } from 'react-icons';
import { HiCheck as Check } from 'react-icons/hi';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import Text from './Text';
import { cn } from './../../lib/utilities';

type Icon = IconType | React.ReactElement;

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  description?: string;
  contained?: boolean;
  disabled?: boolean;
  icon?: Icon;
};

const renderIcon = (Icon: Icon) => {
  return React.useMemo(() => {
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === 'function') return <Icon />;
    return null;
  }, [Icon]);
};

const ItemContent = React.memo(
  ({
    label,
    description,
    iconContainerClassNames,
    icon,
  }: {
    label: string;
    description?: string;
    iconContainerClassNames: string;
    icon?: Icon;
  }) => (
    <>
      {icon && (
        <div className={iconContainerClassNames}>{renderIcon(icon)}</div>
      )}
      <div className="flex flex-col gap-1">
        <Text size="body" weight="medium" className="text-left">
          {label}
        </Text>
        {description && (
          <Text size="caption" intent="subtle">
            {description}
          </Text>
        )}
      </div>
    </>
  )
);
ItemContent.displayName = 'ItemContent';

const Checkbox = ({
  label,
  checked,
  onChange,
  description,
  contained = false,
  disabled = false,
  icon,
}: CheckboxProps) => {
  const content = React.useMemo(
    () => (
      <ItemContent
        label={label}
        description={description}
        iconContainerClassNames={cn(
          'h-9 w-9 aspect-square shrink-0 grid place-items-center rounded-md bg-interface-subtle',
          'group-hover:text-brand',
          'group-data-[state=checked]:bg-brand group-data-[state=checked]:text-white',
          'transition-colors duration-300'
        )}
        icon={icon}
      />
    ),
    [label, description, icon]
  );
  return (
    <div
      className={cn(
        'flex',
        description ? 'items-start' : 'items-center',
        contained
          ? 'min-w-[20.5625rem] gap-x-[0.5rem] rounded border p-[1rem]'
          : 'gap-x-[0.75rem]',
        contained && checked ? 'border-selected' : ''
      )}
    >
      <CheckboxPrimitive.Root
        className={cn(
          !icon &&
            'peer h-4 w-4 shrink-0 rounded border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-info-subtle data-[state=checked]:bg-interface-selected data-[state=checked]:text-onSelected',
          icon &&
            'group flex w-full items-start gap-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interface-focus disabled:cursor-not-allowed disabled:opacity-50'
        )}
        id={`id-${label}`}
        checked={checked}
        onCheckedChange={(val) => onChange(Boolean(val))}
        disabled={disabled}
      >
        {icon ? (
          content
        ) : (
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            <Check className="h-3 w-3" />
          </CheckboxPrimitive.Indicator>
        )}
      </CheckboxPrimitive.Root>
      {!icon && (
        <div className="space-y-px">
          <Text as="p" size="body">
            {label}
          </Text>
          {description ? (
            <p className="text-caption-tight text-subtle">{description}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
