'use client';

import { DsFormField, type DsFormFieldBaseProps } from '../Form';
import { DsCheckbox } from './DsCheckbox';

export type DsFormCheckboxProps = DsFormFieldBaseProps;

/** Boolean checkbox with the label on its side. For "must accept" use `z.boolean().refine(Boolean, '…')`. */
export function DsFormCheckbox(props: DsFormCheckboxProps) {
  return (
    <DsFormField {...props} orientation="horizontal">
      {({ field, controlProps }) => (
        <DsCheckbox
          {...controlProps}
          ref={field.ref}
          name={field.name}
          checked={field.value === true}
          onCheckedChange={(checked) => field.onChange(checked === true)}
          onBlur={field.onBlur}
          disabled={field.disabled}
        />
      )}
    </DsFormField>
  );
}
