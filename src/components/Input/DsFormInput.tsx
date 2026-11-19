'use client';

import { DsFormField, type DsFormFieldBaseProps } from '../Form';
import { DsInput, type DsInputProps } from './DsInput';

export interface DsFormInputProps
  extends DsFormFieldBaseProps,
    Omit<DsInputProps, 'name' | 'id' | 'disabled' | 'className' | 'value' | 'defaultValue' | 'invalid'> {
  inputClassName?: string;
}

/**
 * DsInput wired to the surrounding <DsForm> (react-hook-form) with label, hint and error.
 * Values are strings; for numbers use `z.coerce.number()` in the schema.
 */
export const DsFormInput = ({
  name,
  label,
  description,
  id,
  disabled,
  className,
  inputClassName,
  ...inputProps
}: DsFormInputProps) => {
  return (
    <DsFormField name={name} label={label} description={description} id={id} disabled={disabled} className={className}>
      {({ field, fieldState, controlProps }) => (
        <DsInput
          {...inputProps}
          {...controlProps}
          ref={field.ref}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={field.disabled}
          invalid={fieldState.invalid}
          className={inputClassName}
        />
      )}
    </DsFormField>
  );
};
