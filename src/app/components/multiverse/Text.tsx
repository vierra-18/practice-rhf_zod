import React from 'react';
import { cn } from './../../lib/utilities';

const MAP_SIZE_CLASS = {
  display: 'text-display',
  title: 'text-title',
  heading: 'text-heading',
  subheading: 'text-subheading',
  lead: 'text-lead',
  'body-large': 'text-body-large',
  body: 'text-body',
  caption: 'text-caption',
  overline: 'text-caption font-bold uppercase tracking-[0.5px]',
} as const;

const MAP_WEIGHT_CLASS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

const MAP_LINE_HEIGHT_CLASS = {
  tight: 'leading-tight',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
} as const;

const MAP_INTENT_CLASS = {
  default: 'text',
  inverse: 'text-inverse',
  subtle: 'text-subtle',
  placeholder: 'text-placeholder',
  disabled: 'text-disabled',
  brand: 'text-brand',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  light: 'text-light',
  dark: 'text-dark',
} as const;

type TextProps<T extends React.ElementType = 'span'> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  intent?: keyof typeof MAP_INTENT_CLASS;
  size?: keyof typeof MAP_SIZE_CLASS;
  weight?: keyof typeof MAP_WEIGHT_CLASS;
  lineHeight?: keyof typeof MAP_LINE_HEIGHT_CLASS;
} & React.ComponentPropsWithoutRef<T> &
  (T extends 'label' ? { htmlFor: string } : unknown);

function Text<T extends React.ElementType = 'span'>({
  as,
  children,
  className,
  intent = 'default',
  size = 'body',
  weight = 'normal',
  lineHeight,
  ...props
}: TextProps<T>) {
  const Component = as || 'span';

  return (
    <Component
      className={cn(
        MAP_INTENT_CLASS[intent],
        lineHeight && MAP_LINE_HEIGHT_CLASS[lineHeight],
        MAP_SIZE_CLASS[size],
        MAP_WEIGHT_CLASS[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

Text.displayName = 'Text';

export default Text;
