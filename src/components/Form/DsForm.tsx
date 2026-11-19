"use client";
import type { ComponentProps } from "react";
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

export interface DsFormProps<T extends FieldValues> extends Omit<
  ComponentProps<"form">,
  "onSubmit"
> {
  form: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
}

export const DsForm = <T extends FieldValues>({
  form,
  onSubmit = () => {},
  ...props
}: DsFormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} {...props} />
    </FormProvider>
  );
};
