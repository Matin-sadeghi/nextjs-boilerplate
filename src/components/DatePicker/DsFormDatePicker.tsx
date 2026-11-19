"use client";

import { DsFormField, type DsFormFieldBaseProps } from "../Form";
import { DsDatePicker, type DsDatePickerProps } from "./DsDatePicker";

export interface DsFormDatePickerProps
  extends
    DsFormFieldBaseProps,
    Omit<
      DsDatePickerProps,
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

/** Date field; the form value is a `Date` (use `z.date()` in the schema). */
export function DsFormDatePicker({
  name,
  label,
  description,
  id,
  disabled,
  className,
  triggerClassName,
  ...pickerProps
}: DsFormDatePickerProps) {
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
        <DsDatePicker
          {...pickerProps}
          {...controlProps}
          ref={field.ref}
          value={field.value ?? undefined}
          onValueChange={(date) => {
            field.onChange(date);
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
