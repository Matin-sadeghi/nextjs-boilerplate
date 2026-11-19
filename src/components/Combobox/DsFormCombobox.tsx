"use client";

import { DsFormField, type DsFormFieldBaseProps } from "../Form";
import { DsCombobox, type DsComboboxProps } from "./DsCombobox";

export interface DsFormComboboxProps
  extends
    DsFormFieldBaseProps,
    Omit<
      DsComboboxProps,
      | "value"
      | "onValueChange"
      | "id"
      | "disabled"
      | "className"
      | "invalid"
      | "ref"
      | "onBlur"
    > {
  triggerClassName?: string;
}

export function DsFormCombobox({
  name,
  label,
  description,
  id,
  disabled,
  className,
  triggerClassName,
  ...comboboxProps
}: DsFormComboboxProps) {
  return (
    <DsFormField
      name={name}
      label={label}
      description={description}
      id={id}
      disabled={disabled}
      className={className}
    >
      {({ field, fieldState, controlProps }) => (
        <DsCombobox
          {...comboboxProps}
          {...controlProps}
          ref={field.ref}
          value={field.value ?? undefined}
          onValueChange={(value) => {
            field.onChange(value);
            field.onBlur();
          }}
          onBlur={field.onBlur}
          invalid={fieldState.invalid}
          disabled={field.disabled}
          className={triggerClassName}
        />
      )}
    </DsFormField>
  );
}
