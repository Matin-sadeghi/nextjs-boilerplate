'use client';
import type { ReactNode } from 'react';

import { cn } from '@/src/lib/utils';
import { DsDescription } from '../Field';
import { DsFormField, type DsFormFieldBaseProps } from '../Form';
import { DsLabel } from '../Label';
import { DsRadioGroup, DsRadioGroupItem } from './DsRadioGroup';

export interface DsFormRadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface DsFormRadioGroupProps extends DsFormFieldBaseProps {
  options: DsFormRadioOption[];
  orientation?: 'vertical' | 'horizontal';
}

export function DsFormRadioGroup({ options, orientation = 'vertical', ...fieldProps }: DsFormRadioGroupProps) {
  const id = fieldProps.id ?? fieldProps.name;

  return (
    <DsFormField {...fieldProps}>
      {({ field, controlProps, labelId }) => (
        <DsRadioGroup
          ref={field.ref}
          name={field.name}
          value={field.value ?? ''}
          onValueChange={field.onChange}
          disabled={field.disabled}
          orientation={orientation}
          aria-labelledby={fieldProps.label ? labelId : undefined}
          aria-invalid={controlProps['aria-invalid']}
          aria-describedby={controlProps['aria-describedby']}
          className={cn(orientation === 'horizontal' && 'flex flex-wrap gap-x-6')}
        >
          {options.map((option) => {
            const optionId = `${id}-${option.value}`;
            return (
              <div key={option.value} className="flex items-start gap-3">
                <DsRadioGroupItem
                  id={optionId}
                  value={option.value}
                  disabled={option.disabled}
                  onBlur={field.onBlur}
                  aria-invalid={controlProps['aria-invalid']}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-1">
                  <DsLabel htmlFor={optionId} className="font-normal">
                    {option.label}
                  </DsLabel>
                  {option.description && <DsDescription>{option.description}</DsDescription>}
                </div>
              </div>
            );
          })}
        </DsRadioGroup>
      )}
    </DsFormField>
  );
}
