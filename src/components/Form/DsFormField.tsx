"use client";
import type { ReactNode } from "react";
import {
  useController,
  useFormContext,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/src/lib/utils";
import { DsDescription, DsErrorMessage, DsField } from "../Field";
import { DsLabel } from "../Label";

/** Props every DsForm* component accepts. */
export interface DsFormFieldBaseProps {
  /** Field name in the form values (dot paths like `address.city` work). */
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  /** Defaults to `name`. */
  id?: string;
  disabled?: boolean;
  /** Class for the field wrapper. */
  className?: string;
}

/** Spread onto the control so label, hint and error are announced correctly. */
export interface DsFormControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
}

export interface DsFormFieldRenderProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  controlProps: DsFormControlProps;
  /** id of the label element — use with aria-labelledby on non-labelable controls (radio group). */
  labelId: string;
}

export interface DsFormFieldProps extends DsFormFieldBaseProps {
  /**
   * `vertical`: label above the control (inputs, selects).
   * `horizontal`: control then label on one line (checkbox, switch).
   */
  orientation?: "vertical" | "horizontal";
  children: (props: DsFormFieldRenderProps) => ReactNode;
}

/**
 * Connects any control to the surrounding <DsForm> (react-hook-form) and renders
 * label, description and validation error. All DsForm* components use it; use it
 * directly for one-off controls:
 *
 *   <DsFormField name="color" label="Color">
 *     {({ field, controlProps }) => <MyColorPicker {...controlProps} value={field.value} onChange={field.onChange} />}
 *   </DsFormField>
 */
export function DsFormField({
  name,
  label,
  description,
  id = name,
  disabled,
  className,
  orientation = "vertical",
  children,
}: DsFormFieldProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control, disabled });

  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorMessage = fieldState.error?.message;
  const errorId = errorMessage ? `${id}-error` : undefined;

  const controlProps: DsFormControlProps = {
    id,
    "aria-invalid": fieldState.invalid || undefined,
    "aria-describedby":
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined,
  };

  const labelNode = label && (
    <DsLabel id={labelId} htmlFor={id}>
      {label}
    </DsLabel>
  );
  const descriptionNode = description && (
    <DsDescription id={descriptionId}>{description}</DsDescription>
  );
  const errorNode = errorMessage && (
    <DsErrorMessage id={errorId}>{errorMessage}</DsErrorMessage>
  );
  const controlNode = children({ field, fieldState, controlProps, labelId });

  if (orientation === "horizontal") {
    return (
      <DsField
        disabled={field.disabled}
        className={cn("flex-row items-start gap-3", className)}
      >
        <div className="flex min-h-5 items-center">{controlNode}</div>
        <div className="flex flex-col gap-1.5 pt-0.5">
          {labelNode}
          {descriptionNode}
          {errorNode}
        </div>
      </DsField>
    );
  }

  return (
    <DsField disabled={field.disabled} className={className}>
      {labelNode}
      {controlNode}
      {descriptionNode}
      {errorNode}
    </DsField>
  );
}
