"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Bell,
  Copy,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import {
  createDsColumnHelper,
  DsAccordion,
  DsAccordionContent,
  DsAccordionItem,
  DsAccordionTrigger,
  DsBadge,
  DsBox,
  DsButton,
  DsCheckbox,
  DsDataTable,
  DsDescription,
  DsDialog,
  DsDialogClose,
  DsDialogContent,
  DsDialogDescription,
  DsDialogFooter,
  DsDialogHeader,
  DsDialogTitle,
  DsDialogTrigger,
  DsDirectionProvider,
  DsDropdownMenu,
  DsDropdownMenuCheckboxItem,
  DsDropdownMenuContent,
  DsDropdownMenuGroup,
  DsDropdownMenuItem,
  DsDropdownMenuLabel,
  DsDropdownMenuRadioGroup,
  DsDropdownMenuRadioItem,
  DsDropdownMenuSeparator,
  DsDropdownMenuShortcut,
  DsDropdownMenuSub,
  DsDropdownMenuSubContent,
  DsDropdownMenuSubTrigger,
  DsDropdownMenuTrigger,
  DsErrorMessage,
  DsField,
  DsFieldGroup,
  DsFieldset,
  DsForm,
  DsFormInput,
  DsInput,
  DsLabel,
  DsLegend,
  DsLoading,
  DsPopover,
  DsPopoverContent,
  DsPopoverDescription,
  DsPopoverHeader,
  DsPopoverTitle,
  DsPopoverTrigger,
  DsSelect,
  DsSelectContent,
  DsSelectGroup,
  DsSelectItem,
  DsSelectLabel,
  DsSelectSeparator,
  DsSelectTrigger,
  DsSelectValue,
  DsSeparator,
  DsSkeleton,
  DsTable,
  DsTableBody,
  DsTableCaption,
  DsTableCell,
  DsTableFooter,
  DsTableHead,
  DsTableHeader,
  DsTableRow,
  DsTabs,
  DsTabsContent,
  DsTabsList,
  DsTabsTrigger,
  DsTextarea,
  DsTooltip,
  DsTooltipContent,
  DsTooltipTrigger,
  DsTypography,
  type DsTypographyColor,
} from "@/src/components";
import { useAppForm } from "@/src/hooks";
import { useThemeStore } from "@/src/stores";

/* -------------------------------------------------------------------------- */
/*                                 Demo data                                  */
/* -------------------------------------------------------------------------- */

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
};

const users: User[] = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 4 === 0 ? "admin" : "member",
  createdAt: new Date(2026, 0, 1 + i),
}));

const noUsers: User[] = [];

// Module scope = stable reference (required by TanStack Table).
const col = createDsColumnHelper<User>();
const columns = col.columns([
  col.accessor("id", {
    header: "#",
    meta: { align: "end", cellClassName: "w-12" },
  }),
  col.accessor("name", { header: "Name" }),
  col.accessor("email", { header: "Email", enableSorting: false }),
  col.accessor("role", {
    header: "Role",
    cell: ({ getValue }) => (
      <DsBadge variant={getValue() === "admin" ? "default" : "secondary"}>
        {getValue()}
      </DsBadge>
    ),
  }),
  col.accessor("createdAt", {
    header: "Created",
    cell: ({ getValue }) => getValue().toLocaleDateString(),
  }),
  col.display({
    id: "actions",
    meta: { align: "end" },
    cell: ({ row }) => (
      <DsDropdownMenu>
        <DsDropdownMenuTrigger asChild>
          <DsButton variant="ghost" size="icon-sm" aria-label="Row actions">
            <MoreHorizontal />
          </DsButton>
        </DsDropdownMenuTrigger>
        <DsDropdownMenuContent align="end">
          <DsDropdownMenuItem
            onSelect={() => toast(`Edit ${row.original.name}`)}
          >
            <Pencil /> Edit
          </DsDropdownMenuItem>
          <DsDropdownMenuItem
            variant="destructive"
            onSelect={() => toast(`Delete ${row.original.name}`)}
          >
            <Trash2 /> Delete
          </DsDropdownMenuItem>
        </DsDropdownMenuContent>
      </DsDropdownMenu>
    ),
  }),
]);

const invoices = [
  { id: "INV-001", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV-002", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV-003", status: "Unpaid", method: "Bank transfer", amount: 350 },
];

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email"),
});

const typographyColors: DsTypographyColor[] = [
  "default",
  "heading",
  "secondary",
  "muted",
  "primary",
  "success",
  "warning",
  "danger",
  "info",
];

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */

const Section = ({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <DsBox
    as="section"
    id={id}
    variant="card"
    padding="lg"
    shadow
    className="flex scroll-mt-6 flex-col gap-5"
  >
    <div className="flex flex-col gap-1">
      <DsTypography variant="h4" as="h2">
        {title}
      </DsTypography>
      {description && (
        <DsTypography variant="helperText">{description}</DsTypography>
      )}
    </div>
    <DsSeparator />
    {children}
  </DsBox>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <DsTypography variant="caption">{label}</DsTypography>
    <div className="flex flex-wrap items-center gap-2">{children}</div>
  </div>
);

const sections = [
  ["typography", "Typography"],
  ["box", "Box"],
  ["buttons", "Buttons"],
  ["badges", "Badges"],
  ["inputs", "Inputs"],
  ["form", "Form"],
  ["overlays", "Overlays"],
  ["tabs", "Tabs"],
  ["accordion", "Accordion"],
  ["loading", "Loading"],
  ["table", "Table"],
  ["data-table", "Data table"],
  ["rtl", "RTL"],
] as const;

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function UiKitPage() {
  const { toggleTheme, theme } = useThemeStore();

  // Inputs
  const [agree, setAgree] = useState(false);
  const [fruit, setFruit] = useState("apple");

  // Dropdown
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [position, setPosition] = useState("bottom");

  // Data table
  const [tableLoading, setTableLoading] = useState(false);

  // Form
  const form = useAppForm(profileSchema, { fullName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success(`Saved ${data.fullName}`);
    form.reset();
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <DsTypography variant="h2" as="h1">
            UI kit
          </DsTypography>
          <DsTypography variant="helperText">
            Every component in <code className="font-mono">src/components</code>
            , in one place.
          </DsTypography>
        </div>
        <DsButton variant="outline" onClick={toggleTheme}>
          Theme: {theme}
        </DsButton>
      </div>

      <nav className="flex flex-wrap gap-1.5">
        {sections.map(([id, label]) => (
          <DsBadge key={id} variant="outline" asChild>
            <a href={`#${id}`}>{label}</a>
          </DsBadge>
        ))}
      </nav>

      {/* Typography */}
      <Section
        id="typography"
        title="DsTypography"
        description="Variants pick the tag and a default color."
      >
        <div className="flex flex-col gap-2">
          <DsTypography variant="h1">Heading 1</DsTypography>
          <DsTypography variant="h2">Heading 2</DsTypography>
          <DsTypography variant="h3">Heading 3</DsTypography>
          <DsTypography variant="h4">Heading 4</DsTypography>
          <DsTypography variant="body">
            Body — the quick brown fox jumps over the lazy dog.
          </DsTypography>
          <DsTypography variant="bodySmall">
            Body small — the quick brown fox.
          </DsTypography>
          <DsTypography variant="helperText">
            Helper text — secondary information.
          </DsTypography>
          <DsTypography variant="caption">
            Caption — muted, extra small.
          </DsTypography>
        </div>
        <Row label="color">
          {typographyColors.map((color) => (
            <DsTypography
              key={color}
              as="span"
              variant="bodySmall"
              color={color}
              className="font-medium"
            >
              {color}
            </DsTypography>
          ))}
        </Row>
      </Section>

      {/* Box */}
      <Section
        id="box"
        title="DsBox"
        description="Polymorphic container with surface, padding and shadow variants."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <DsBox
            variant="plain"
            padding="md"
            className="border border-dashed border-border"
          >
            <DsTypography variant="bodySmall">plain</DsTypography>
          </DsBox>
          <DsBox variant="card" padding="md">
            <DsTypography variant="bodySmall">card</DsTypography>
          </DsBox>
          <DsBox variant="muted" padding="md">
            <DsTypography variant="bodySmall">muted</DsTypography>
          </DsBox>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <DsBox variant="card" padding="md" shadow="sm">
            <DsTypography variant="bodySmall">shadow=&quot;sm&quot;</DsTypography>
          </DsBox>
          <DsBox variant="card" padding="md" shadow="md">
            <DsTypography variant="bodySmall">shadow=&quot;md&quot; (or shadow)</DsTypography>
          </DsBox>
          <DsBox variant="card" padding="md" shadow="lg">
            <DsTypography variant="bodySmall">shadow=&quot;lg&quot;</DsTypography>
          </DsBox>
        </div>
      </Section>

      {/* Buttons */}
      <Section id="buttons" title="DsButton">
        <Row label="variant">
          <DsButton>Primary</DsButton>
          <DsButton variant="secondary">Secondary</DsButton>
          <DsButton variant="outline">Outline</DsButton>
          <DsButton variant="ghost">Ghost</DsButton>
          <DsButton variant="danger">Danger</DsButton>
          <DsButton variant="link">Link</DsButton>
        </Row>
        <Row label="size">
          <DsButton size="xs">Extra small</DsButton>
          <DsButton size="sm">Small</DsButton>
          <DsButton size="md">Medium</DsButton>
          <DsButton size="lg">Large</DsButton>
        </Row>
        <Row label="icon sizes">
          <DsButton size="icon-xs" variant="outline" aria-label="Add">
            <Plus />
          </DsButton>
          <DsButton size="icon-sm" variant="outline" aria-label="Add">
            <Plus />
          </DsButton>
          <DsButton size="icon" variant="outline" aria-label="Add">
            <Plus />
          </DsButton>
          <DsButton size="icon-lg" variant="outline" aria-label="Add">
            <Plus />
          </DsButton>
        </Row>
        <Row label="states">
          <DsButton>
            <Mail /> With icon
          </DsButton>
          <DsButton loading>Saving</DsButton>
          <DsButton disabled>Disabled</DsButton>
          <DsButton variant="outline" asChild>
            <Link href="/">asChild → Link</Link>
          </DsButton>
        </Row>
      </Section>

      {/* Badges */}
      <Section id="badges" title="DsBadge">
        <Row label="variant">
          <DsBadge>Default</DsBadge>
          <DsBadge variant="secondary">Secondary</DsBadge>
          <DsBadge variant="destructive">Destructive</DsBadge>
          <DsBadge variant="outline">Outline</DsBadge>
          <DsBadge variant="ghost">Ghost</DsBadge>
          <DsBadge variant="link">Link</DsBadge>
          <DsBadge>
            <Bell /> With icon
          </DsBadge>
        </Row>
      </Section>

      {/* Inputs */}
      <Section
        id="inputs"
        title="Inputs"
        description="DsFieldset, DsLegend, DsFieldGroup, DsField, DsLabel, DsInput, DsTextarea, DsCheckbox, DsSelect, DsDescription, DsErrorMessage."
      >
        <DsFieldset>
          <DsLegend>Account</DsLegend>
          <DsDescription>Grouped fields share a legend.</DsDescription>
          <DsFieldGroup className="grid gap-5 sm:grid-cols-2">
            <DsField>
              <DsLabel htmlFor="kit-email">Email</DsLabel>
              <DsInput
                id="kit-email"
                type="email"
                placeholder="you@example.com"
                startIcon={<Mail />}
              />
              <DsDescription>We never share your email.</DsDescription>
            </DsField>
            <DsField>
              <DsLabel htmlFor="kit-search">Search</DsLabel>
              <DsInput
                id="kit-search"
                placeholder="Search…"
                endIcon={<Search />}
              />
            </DsField>
            <DsField>
              <DsLabel htmlFor="kit-invalid">Invalid</DsLabel>
              <DsInput
                id="kit-invalid"
                defaultValue="wrong value"
                invalid
                aria-describedby="kit-invalid-error"
              />
              <DsErrorMessage id="kit-invalid-error">
                This value is not allowed.
              </DsErrorMessage>
            </DsField>
            <DsField disabled>
              <DsLabel htmlFor="kit-disabled">Disabled</DsLabel>
              <DsInput
                id="kit-disabled"
                placeholder="Can't type here"
                disabled
              />
            </DsField>
          </DsFieldGroup>
        </DsFieldset>

        <Row label="DsInput size">
          <DsInput size="sm" placeholder="sm" className="w-40" />
          <DsInput size="md" placeholder="md" className="w-40" />
          <DsInput size="lg" placeholder="lg" className="w-40" />
        </Row>

        <div className="grid gap-5 sm:grid-cols-2">
          <DsField>
            <DsLabel htmlFor="kit-bio">Bio</DsLabel>
            <DsTextarea id="kit-bio" placeholder="Tell us about yourself" />
          </DsField>

          <div className="flex flex-col gap-5">
            <DsField>
              <DsLabel htmlFor="kit-fruit">Favorite fruit</DsLabel>
              <DsSelect value={fruit} onValueChange={setFruit}>
                <DsSelectTrigger id="kit-fruit" className="w-full">
                  <DsSelectValue placeholder="Pick one" />
                </DsSelectTrigger>
                <DsSelectContent>
                  <DsSelectGroup>
                    <DsSelectLabel>Fruits</DsSelectLabel>
                    <DsSelectItem value="apple">Apple</DsSelectItem>
                    <DsSelectItem value="banana">Banana</DsSelectItem>
                    <DsSelectItem value="orange">Orange</DsSelectItem>
                  </DsSelectGroup>
                  <DsSelectSeparator />
                  <DsSelectGroup>
                    <DsSelectLabel>Vegetables</DsSelectLabel>
                    <DsSelectItem value="carrot">Carrot</DsSelectItem>
                    <DsSelectItem value="potato" disabled>
                      Potato (disabled)
                    </DsSelectItem>
                  </DsSelectGroup>
                </DsSelectContent>
              </DsSelect>
            </DsField>

            <div className="flex items-center gap-2">
              <DsCheckbox
                id="kit-agree"
                checked={agree}
                onCheckedChange={(v) => setAgree(v === true)}
              />
              <DsLabel htmlFor="kit-agree">I agree to the terms</DsLabel>
            </div>
            <div className="flex items-center gap-2">
              <DsCheckbox id="kit-checkbox-disabled" disabled defaultChecked />
              <DsLabel htmlFor="kit-checkbox-disabled">
                Disabled checkbox
              </DsLabel>
            </div>
          </div>
        </div>
      </Section>

      {/* Form */}
      <Section
        id="form"
        title="DsForm + DsFormInput"
        description="react-hook-form + zod. Submit empty to see validation (on blur / on submit)."
      >
        <DsForm
          form={form}
          onSubmit={onSubmit}
          className="grid gap-5 sm:grid-cols-2"
        >
          <DsFormInput
            name="fullName"
            label="Full name"
            placeholder="Ada Lovelace"
            startIcon={<UserIcon />}
          />
          <DsFormInput
            name="email"
            type="email"
            label="Email"
            placeholder="ada@example.com"
            description="Used for notifications."
          />
          <div className="flex gap-2 sm:col-span-2">
            <DsButton type="submit" loading={saving}>
              Save
            </DsButton>
            <DsButton variant="ghost" onClick={() => form.reset()}>
              Reset
            </DsButton>
          </div>
        </DsForm>
      </Section>

      {/* Overlays */}
      <Section
        id="overlays"
        title="Overlays"
        description="DsDialog, DsPopover, DsTooltip, DsDropdownMenu."
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Dialog */}
          <DsDialog>
            <DsDialogTrigger asChild>
              <DsButton variant="outline">Open dialog</DsButton>
            </DsDialogTrigger>
            <DsDialogContent>
              <DsDialogHeader>
                <DsDialogTitle>Edit profile</DsDialogTitle>
                <DsDialogDescription>
                  Radix handles focus trap, Esc and scroll lock.
                </DsDialogDescription>
              </DsDialogHeader>
              <DsField>
                <DsLabel htmlFor="dialog-name">Name</DsLabel>
                <DsInput id="dialog-name" defaultValue="Ada Lovelace" />
              </DsField>
              <DsDialogFooter>
                <DsDialogClose asChild>
                  <DsButton variant="outline">Cancel</DsButton>
                </DsDialogClose>
                <DsDialogClose asChild>
                  <DsButton onClick={() => toast.success("Profile saved")}>
                    Save
                  </DsButton>
                </DsDialogClose>
              </DsDialogFooter>
            </DsDialogContent>
          </DsDialog>

          {/* Popover */}
          <DsPopover>
            <DsPopoverTrigger asChild>
              <DsButton variant="outline">Open popover</DsButton>
            </DsPopoverTrigger>
            <DsPopoverContent className="w-72">
              <DsPopoverHeader>
                <DsPopoverTitle>Dimensions</DsPopoverTitle>
                <DsPopoverDescription>
                  Set the dimensions for the layer.
                </DsPopoverDescription>
              </DsPopoverHeader>
              <div className="grid grid-cols-2 gap-2">
                <DsInput size="sm" defaultValue="100%" aria-label="Width" />
                <DsInput size="sm" defaultValue="25px" aria-label="Height" />
              </div>
            </DsPopoverContent>
          </DsPopover>

          {/* Tooltip */}
          <DsTooltip>
            <DsTooltipTrigger asChild>
              <DsButton variant="outline" size="icon" aria-label="Share">
                <Share2 />
              </DsButton>
            </DsTooltipTrigger>
            <DsTooltipContent>Share this page</DsTooltipContent>
          </DsTooltip>

          {/* Dropdown menu */}
          <DsDropdownMenu>
            <DsDropdownMenuTrigger asChild>
              <DsButton variant="outline">
                <Settings /> Open menu
              </DsButton>
            </DsDropdownMenuTrigger>
            <DsDropdownMenuContent className="w-56" align="start">
              <DsDropdownMenuLabel>My account</DsDropdownMenuLabel>
              <DsDropdownMenuGroup>
                <DsDropdownMenuItem>
                  <UserIcon /> Profile
                  <DsDropdownMenuShortcut>⇧⌘P</DsDropdownMenuShortcut>
                </DsDropdownMenuItem>
                <DsDropdownMenuItem>
                  <Copy /> Duplicate
                  <DsDropdownMenuShortcut>⌘D</DsDropdownMenuShortcut>
                </DsDropdownMenuItem>
                <DsDropdownMenuSub>
                  <DsDropdownMenuSubTrigger>
                    <Share2 /> Share
                  </DsDropdownMenuSubTrigger>
                  <DsDropdownMenuSubContent>
                    <DsDropdownMenuItem>Email</DsDropdownMenuItem>
                    <DsDropdownMenuItem>Message</DsDropdownMenuItem>
                  </DsDropdownMenuSubContent>
                </DsDropdownMenuSub>
              </DsDropdownMenuGroup>
              <DsDropdownMenuSeparator />
              <DsDropdownMenuLabel>View</DsDropdownMenuLabel>
              <DsDropdownMenuCheckboxItem
                checked={showStatusBar}
                onCheckedChange={setShowStatusBar}
              >
                Status bar
              </DsDropdownMenuCheckboxItem>
              <DsDropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Panel
              </DsDropdownMenuCheckboxItem>
              <DsDropdownMenuSeparator />
              <DsDropdownMenuLabel>Panel position</DsDropdownMenuLabel>
              <DsDropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DsDropdownMenuRadioItem value="top">
                  Top
                </DsDropdownMenuRadioItem>
                <DsDropdownMenuRadioItem value="bottom">
                  Bottom
                </DsDropdownMenuRadioItem>
                <DsDropdownMenuRadioItem value="right">
                  Right
                </DsDropdownMenuRadioItem>
              </DsDropdownMenuRadioGroup>
              <DsDropdownMenuSeparator />
              <DsDropdownMenuItem variant="destructive">
                <Trash2 /> Delete account
              </DsDropdownMenuItem>
            </DsDropdownMenuContent>
          </DsDropdownMenu>
        </div>
      </Section>

      {/* Accordion */}
      <Section
        id="accordion"
        title="DsAccordion"
        description='type="single" (one open at a time, collapsible) or type="multiple".'
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Row label='variant="default" · type="single"'>
            <DsAccordion type="single" collapsible defaultValue="shipping" className="w-full">
              <DsAccordionItem value="shipping">
                <DsAccordionTrigger>How long does shipping take?</DsAccordionTrigger>
                <DsAccordionContent>
                  Orders ship within 2 business days and usually arrive in 3–5 days.
                </DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="returns">
                <DsAccordionTrigger>What is your return policy?</DsAccordionTrigger>
                <DsAccordionContent>
                  <p>You can return any item within 30 days of delivery.</p>
                  <p>
                    Read the <a href="#accordion">full policy</a> for details.
                  </p>
                </DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="disabled" disabled>
                <DsAccordionTrigger>Disabled item</DsAccordionTrigger>
                <DsAccordionContent>Not reachable.</DsAccordionContent>
              </DsAccordionItem>
            </DsAccordion>
          </Row>

          <Row label='variant="card" · type="multiple"'>
            <DsAccordion type="multiple" variant="card" defaultValue={["account"]} className="w-full">
              <DsAccordionItem value="account">
                <DsAccordionTrigger>Account settings</DsAccordionTrigger>
                <DsAccordionContent>Manage your name, email and password.</DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="notifications">
                <DsAccordionTrigger>Notifications</DsAccordionTrigger>
                <DsAccordionContent>Choose which emails and alerts you receive.</DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="billing">
                <DsAccordionTrigger>Billing</DsAccordionTrigger>
                <DsAccordionContent>Update your payment method and view invoices.</DsAccordionContent>
              </DsAccordionItem>
            </DsAccordion>
          </Row>
        </div>
      </Section>

      {/* Tabs */}
      <Section id="tabs" title="DsTabs">
        <Row label='variant="default"'>
          <DsTabs defaultValue="account" className="w-full">
            <DsTabsList>
              <DsTabsTrigger value="account">Account</DsTabsTrigger>
              <DsTabsTrigger value="password">Password</DsTabsTrigger>
              <DsTabsTrigger value="disabled" disabled>
                Disabled
              </DsTabsTrigger>
            </DsTabsList>
            <DsTabsContent value="account">
              <DsBox variant="muted" padding="md">
                <DsTypography variant="bodySmall">
                  Make changes to your account here.
                </DsTypography>
              </DsBox>
            </DsTabsContent>
            <DsTabsContent value="password">
              <DsBox variant="muted" padding="md">
                <DsTypography variant="bodySmall">
                  Change your password here.
                </DsTypography>
              </DsBox>
            </DsTabsContent>
          </DsTabs>
        </Row>
        <Row label='variant="line"'>
          <DsTabs defaultValue="overview" className="w-full">
            <DsTabsList variant="line">
              <DsTabsTrigger value="overview">Overview</DsTabsTrigger>
              <DsTabsTrigger value="analytics">Analytics</DsTabsTrigger>
              <DsTabsTrigger value="reports">Reports</DsTabsTrigger>
            </DsTabsList>
            <DsTabsContent value="overview">
              <DsTypography variant="helperText">
                Overview content.
              </DsTypography>
            </DsTabsContent>
            <DsTabsContent value="analytics">
              <DsTypography variant="helperText">
                Analytics content.
              </DsTypography>
            </DsTabsContent>
            <DsTabsContent value="reports">
              <DsTypography variant="helperText">Reports content.</DsTypography>
            </DsTabsContent>
          </DsTabs>
        </Row>
      </Section>

      {/* Loading */}
      <Section id="loading" title="DsLoading + DsSkeleton">
        <div className="grid gap-6 sm:grid-cols-2">
          <DsBox variant="muted">
            <DsLoading label="Loading data…" />
          </DsBox>
          <div className="flex items-center gap-4">
            <DsSkeleton className="size-12 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <DsSkeleton className="h-4 w-3/4" />
              <DsSkeleton className="h-4 w-1/2" />
              <DsSkeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </Section>

      {/* Static table */}
      <Section
        id="table"
        title="DsTable"
        description="Plain table primitives for static content."
      >
        <DsTable>
          <DsTableCaption>A list of recent invoices.</DsTableCaption>
          <DsTableHeader>
            <DsTableRow>
              <DsTableHead>Invoice</DsTableHead>
              <DsTableHead>Status</DsTableHead>
              <DsTableHead>Method</DsTableHead>
              <DsTableHead className="text-end">Amount</DsTableHead>
            </DsTableRow>
          </DsTableHeader>
          <DsTableBody>
            {invoices.map((inv) => (
              <DsTableRow key={inv.id}>
                <DsTableCell className="font-medium">{inv.id}</DsTableCell>
                <DsTableCell>
                  <DsBadge
                    variant={
                      inv.status === "Paid"
                        ? "default"
                        : inv.status === "Unpaid"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {inv.status}
                  </DsBadge>
                </DsTableCell>
                <DsTableCell>{inv.method}</DsTableCell>
                <DsTableCell className="text-end">
                  ${inv.amount.toFixed(2)}
                </DsTableCell>
              </DsTableRow>
            ))}
          </DsTableBody>
          <DsTableFooter>
            <DsTableRow>
              <DsTableCell colSpan={3}>Total</DsTableCell>
              <DsTableCell className="text-end">
                ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
              </DsTableCell>
            </DsTableRow>
          </DsTableFooter>
        </DsTable>
      </Section>

      {/* Data table */}
      <Section
        id="data-table"
        title="DsDataTable"
        description="TanStack Table v9: sorting, pagination, loading, empty state, row click."
      >
        <div className="flex items-center gap-2">
          <DsCheckbox
            id="kit-table-loading"
            checked={tableLoading}
            onCheckedChange={(v) => setTableLoading(v === true)}
          />
          <DsLabel htmlFor="kit-table-loading">Loading (refetch state)</DsLabel>
        </div>
        <DsDataTable
          columns={columns}
          data={users}
          getRowId={(u) => String(u.id)}
          loading={tableLoading}
          onRowClick={(u) => toast(`Clicked ${u.name}`)}
        />
        <Row label="loading with no data → skeleton">
          <DsDataTable
            columns={columns}
            data={noUsers}
            loading
            paginated={false}
            className="w-full"
          />
        </Row>
        <Row label="empty state">
          <DsDataTable
            columns={columns}
            data={noUsers}
            paginated={false}
            labels={{ empty: "No users yet." }}
            className="w-full"
          />
        </Row>
      </Section>

      {/* RTL */}
      <Section
        id="rtl"
        title="DsDirectionProvider"
        description="A right-to-left island. Set APP_DIR in src/constants/locale.ts to flip the whole app."
      >
        <DsDirectionProvider dir="rtl">
          <div dir="rtl" className="flex flex-col gap-4">
            <DsField>
              <DsLabel htmlFor="kit-rtl-search">جستجو</DsLabel>
              <DsInput
                id="kit-rtl-search"
                placeholder="نام کاربر…"
                startIcon={<Search />}
              />
            </DsField>
            <div className="flex flex-wrap items-center gap-2">
              <DsButton>
                <Plus /> افزودن
              </DsButton>
              <DsDropdownMenu>
                <DsDropdownMenuTrigger asChild>
                  <DsButton variant="outline">منو</DsButton>
                </DsDropdownMenuTrigger>
                <DsDropdownMenuContent align="start">
                  <DsDropdownMenuItem>
                    <Pencil /> ویرایش
                  </DsDropdownMenuItem>
                  <DsDropdownMenuItem variant="destructive">
                    <Trash2 /> حذف
                  </DsDropdownMenuItem>
                </DsDropdownMenuContent>
              </DsDropdownMenu>
              <DsBadge variant="secondary">نشان</DsBadge>
            </div>
          </div>
        </DsDirectionProvider>
      </Section>
    </div>
  );
}
