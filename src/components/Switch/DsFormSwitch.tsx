"use client";

import { DsFormField, type DsFormFieldBaseProps } from "../Form";
import { DsSwitch } from "./DsSwitch";

export interface DsFormSwitchProps extends DsFormFieldBaseProps {
  size?: "sm" | "default";
}

export function DsFormSwitch({ size, ...fieldProps }: DsFormSwitchProps) {
  return (
    <DsFormField {...fieldProps} orientation="horizontal">
      {({ field, controlProps }) => (
        <DsSwitch
          {...controlProps}
          ref={field.ref}
          name={field.name}
          size={size}
          checked={field.value === true}
          onCheckedChange={field.onChange}
          onBlur={field.onBlur}
          disabled={field.disabled}
        />
      )}
    </DsFormField>
  );
}
