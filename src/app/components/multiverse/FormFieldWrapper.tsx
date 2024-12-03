import { useMemo } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { cn } from './../../lib/utilities';

export type FieldError =
  | {
      message: string;
    }
  | string;

export type Props = {
  name?: string;
  error?: FieldError;
  readOnly?: boolean;
} & (
  | {
      inline: true;
    }
  | {
      inline?: never;
      label?: string;
      optional?: boolean;
      helpText?: string;
    }
);

const FormFieldWrapper = ({
  name,
  error,
  children,
  readOnly,
  ...rest
}: Props & {
  children: React.ReactNode;
}) => {
  const { inline, label, helpText, optional } = useMemo(() => {
    if (rest.inline)
      return {
        ...rest,
        label: undefined,
        optional: undefined,
        helpText: undefined,
      };
    return { ...rest, inline: false };
  }, [rest]);
  return (
    <div className="flex flex-col items-start space-y-1">
      {(label || optional) && !inline ? (
        <label
          htmlFor={name}
          className="text-xs w-full font-medium leading-[0.875rem] text-subtle"
        >
          {label}
          {optional && !readOnly ? (
            <>
              {' - '}
              <span className="font-light italic">optional</span>
            </>
          ) : null}
        </label>
      ) : null}
      {children}
      {!inline && (
        <small
          className={cn(
            'text-xs !mt-0.5 flex min-h-[1rem] items-center space-x-1 text',
            (!error && !helpText) || readOnly ? 'invisible' : '',
            error ? 'text-onDanger-subtle' : ''
          )}
        >
          {error ? (
            <>
              <HiOutlineExclamationCircle />
              <span>{typeof error === 'object' ? error?.message : error}</span>
            </>
          ) : (
            helpText
          )}
        </small>
      )}
    </div>
  );
};

export default FormFieldWrapper;
