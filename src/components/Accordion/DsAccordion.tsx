'use client';

import type { ComponentProps } from 'react';
import { ChevronDown } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/src/lib/utils';

export type DsAccordionVariant = 'default' | 'card';

type DsAccordionProps = ComponentProps<typeof AccordionPrimitive.Root> & {
  /** `default`: items separated by lines. `card`: each item is a bordered card. */
  variant?: DsAccordionVariant;
};

/**
 * Usage:
 *   <DsAccordion type="single" collapsible defaultValue="a">
 *     <DsAccordionItem value="a">
 *       <DsAccordionTrigger>Question</DsAccordionTrigger>
 *       <DsAccordionContent>Answer</DsAccordionContent>
 *     </DsAccordionItem>
 *   </DsAccordion>
 * Use `type="multiple"` to allow several open items.
 */
function DsAccordion({ variant = 'default', className, ...props }: DsAccordionProps) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn('group/accordion flex w-full flex-col', variant === 'card' && 'gap-3', className)}
      {...props}
    />
  );
}

function DsAccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        'border-border not-last:border-b',
        'group-data-[variant=card]/accordion:rounded-xl group-data-[variant=card]/accordion:border group-data-[variant=card]/accordion:bg-card group-data-[variant=card]/accordion:px-4',
        className,
      )}
      {...props}
    />
  );
}

function DsAccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group/accordion-trigger flex flex-1 cursor-pointer items-center justify-between gap-4 rounded-lg py-4 text-start text-sm font-medium text-foreground transition-all outline-none',
          'hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function DsAccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm text-foreground-secondary data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn('pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { DsAccordion, DsAccordionContent, DsAccordionItem, DsAccordionTrigger };
