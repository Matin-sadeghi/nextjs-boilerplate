'use client';
import type { ReactNode } from 'react';

import { DsFormField, type DsFormFieldBaseProps } from '../Form';
import { DsSelect, DsSelectContent, DsSelectItem, DsSelectTrigger, DsSelectValue } from './DsSelect';

export interface DsFormSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface DsFormSelectProps extends DsFormFieldBaseProps {
  /** Simple list of options. For groups/separators pass `children` (DsSelectGroup, DsSelectItem…) instead. */
  options?: DsFormSelectOption[];
  children?: ReactNode;
  placeholder?: string;
  triggerClassName?: string;
}

export function DsFormSelect({ options, children, placeholder, triggerClassName, ...fieldProps }: DsFormSelectProps) {
  return (
    <DsFormField {...fieldProps}>
      {({ field, controlProps }) => (
        <DsSelect
          name={field.name}
          // Radix Select needs `undefined` (not '') to show the placeholder.
          value={field.value || undefined}
          onValueChange={field.onChange}
          disabled={field.disabled}
          onOpenChange={(open) => !open && field.onBlur()}
        >
          <DsSelectTrigger ref={field.ref} {...controlProps} className={triggerClassName ?? 'w-full'}>
            <DsSelectValue placeholder={placeholder} />
          </DsSelectTrigger>
          <DsSelectContent>
            {children ??
              options?.map((option) => (
                <DsSelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </DsSelectItem>
              ))}
          </DsSelectContent>
        </DsSelect>
      )}
    </DsFormField>
  );
}
