'use client';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { DsDescription, DsErrorMessage, DsField } from '../Field';
import { DsLabel } from '../Label';
import { DsInput, type DsInputProps } from './DsInput';

export interface DsFormInputProps extends Omit<DsInputProps, 'name'> {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
}

/** DsInput wired to the surrounding <DsForm> (react-hook-form) with label, hint and error. */
export const DsFormInput = ({ name, label, description, id = name, ...inputProps }: DsFormInputProps) => {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error?.message ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <DsField disabled={inputProps.disabled}>
      {label && <DsLabel htmlFor={id}>{label}</DsLabel>}
      <DsInput
        id={id}
        invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...inputProps}
        {...register(name)}
      />
      {description && <DsDescription id={descriptionId}>{description}</DsDescription>}
      {error?.message && <DsErrorMessage id={errorId}>{error.message}</DsErrorMessage>}
    </DsField>
  );
};
