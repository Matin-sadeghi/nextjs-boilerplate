"use client";
import type { ReactNode } from "react";

import { DsButton, type DsButtonVariant } from "../Button";
import {
  DsDialog,
  DsDialogClose,
  DsDialogContent,
  DsDialogDescription,
  DsDialogFooter,
  DsDialogHeader,
  DsDialogTitle,
  DsDialogTrigger,
} from "./DsDialog";

export type DsCustomDialogProps = {
  title: ReactNode;
  description?: ReactNode;
  /** Dialog body. */
  children?: ReactNode;

  /** Label of the default trigger button. Ignored when `trigger` is set. */
  openText?: ReactNode;
  /** Default: "outline". */
  openVariant?: DsButtonVariant;
  /** Custom trigger element (must accept a ref, e.g. a DsButton). Omit both to control the dialog only via `open`. */
  trigger?: ReactNode;

  /** Controlled state — omit both to let the dialog manage itself. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;

  /** Default: "Cancel". Pass `null` to hide the cancel button. */
  cancelText?: ReactNode;
  /** Confirm button is rendered only when this is set. */
  confirmText?: ReactNode;
  /** Default: "primary". */
  confirmVariant?: DsButtonVariant;
  /** Default: "ghost". */
  closeVariant?: DsButtonVariant;

  onConfirm?: () => void;
  /** Closes the dialog after `onConfirm`. Default: true (ignored with `formId`). */
  closeOnConfirm?: boolean;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  /**
   * Makes the confirm button submit the `<form id={formId}>` inside the body.
   * The dialog then stays open — close it yourself from the form's submit handler.
   */
  formId?: string;
  /** Replaces the built-in footer. Pass `null` to hide the footer entirely. */
  footer?: ReactNode;

  /** Applied to DsDialogContent, e.g. "sm:max-w-md". */
  className?: string;
  /** The ✕ button in the corner. Default: true. */
  showCloseButton?: boolean;
};

export function DsCustomDialog({
  title,
  description,
  children,
  openText,
  openVariant = "outline",
  trigger,
  open,
  onOpenChange,
  defaultOpen,
  cancelText = "Cancel",
  confirmText,
  confirmVariant = "primary",
  closeVariant = "outline",
  onConfirm,
  closeOnConfirm = true,
  confirmLoading,
  confirmDisabled,
  formId,
  footer,
  className,
  showCloseButton = true,
}: DsCustomDialogProps) {
  const triggerNode =
    trigger ??
    (openText != null ? (
      <DsButton variant={openVariant}>{openText}</DsButton>
    ) : null);

  const confirmButton =
    confirmText == null ? null : formId ? (
      <DsButton
        type="submit"
        form={formId}
        variant={confirmVariant}
        loading={confirmLoading}
        disabled={confirmDisabled}
      >
        {confirmText}
      </DsButton>
    ) : (
      <DsButton
        variant={confirmVariant}
        loading={confirmLoading}
        disabled={confirmDisabled}
        onClick={() => {
          onConfirm?.();
          if (closeOnConfirm) onOpenChange?.(false);
        }}
      >
        {confirmText}
      </DsButton>
    );

  const footerNode =
    footer !== undefined ? (
      footer
    ) : cancelText == null && confirmButton == null ? null : (
      <DsDialogFooter>
        {cancelText != null && (
          <DsDialogClose asChild>
            <DsButton variant={closeVariant}>{cancelText}</DsButton>
          </DsDialogClose>
        )}
        {confirmButton &&
          (closeOnConfirm && !formId && open === undefined ? (
            // Uncontrolled: let Radix close it.
            <DsDialogClose asChild>{confirmButton}</DsDialogClose>
          ) : (
            confirmButton
          ))}
      </DsDialogFooter>
    );

  return (
    <DsDialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {triggerNode && <DsDialogTrigger asChild>{triggerNode}</DsDialogTrigger>}
      <DsDialogContent className={className} showCloseButton={showCloseButton}>
        <DsDialogHeader>
          <DsDialogTitle>{title}</DsDialogTitle>
          {description != null && (
            <DsDialogDescription>{description}</DsDialogDescription>
          )}
        </DsDialogHeader>
        {children}
        {footerNode}
      </DsDialogContent>
    </DsDialog>
  );
}
