'use client';
import { useFormContext } from 'react-hook-form';

import { DsInput, type DsInputProps } from './DsInput';

export interface DsFormInputProps extends Omit<DsInputProps, 'name'> {
  name: string;
  label?: string;
}

export const DsFormInput = ({ name, label, id = name, ...inputProps }: DsFormInputProps) => {
  const { register, getFieldState, formState } = useFormContext();
  const { error } = getFieldState(name, formState);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-(--color-text-primary)">
          {label}
        </label>
      )}
      <DsInput id={id} invalid={Boolean(error)} {...inputProps} {...register(name)} />
      {error?.message && <p className="text-sm text-(--color-danger)">{error.message}</p>}
    </div>
  );
};
