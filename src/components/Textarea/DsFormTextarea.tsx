'use client';
import type { ComponentProps } from 'react';

import { DsFormField, type DsFormFieldBaseProps } from '../Form';
import { DsTextarea } from './DsTextarea';

export interface DsFormTextareaProps
  extends DsFormFieldBaseProps,
    Omit<ComponentProps<typeof DsTextarea>, 'name' | 'id' | 'disabled' | 'className' | 'value' | 'defaultValue'> {
  textareaClassName?: string;
}

export function DsFormTextarea({
  name,
  label,
  description,
  id,
  disabled,
  className,
  textareaClassName,
  ...textareaProps
}: DsFormTextareaProps) {
  return (
    <DsFormField name={name} label={label} description={description} id={id} disabled={disabled} className={className}>
      {({ field, controlProps }) => (
        <DsTextarea
          {...textareaProps}
          {...controlProps}
          ref={field.ref}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={field.disabled}
          className={textareaClassName}
        />
      )}
    </DsFormField>
  );
}
