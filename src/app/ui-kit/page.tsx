"use client";

import { Suspense, use, useEffect, useState, type ReactNode } from "react";
import { io } from "next/cache";
import Link from "next/link";
import {
  Bell,
  CalendarIcon,
  Copy,
  FolderOpen,
  Home,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  User as UserIcon,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { z } from "zod";

import {
  createDsColumnHelper,
  DsAccordion,
  DsAccordionContent,
  DsAccordionItem,
  DsAccordionTrigger,
  DsAlertDialog,
  DsAlertDialogAction,
  DsAlertDialogCancel,
  DsAlertDialogContent,
  DsAlertDialogDescription,
  DsAlertDialogFooter,
  DsAlertDialogHeader,
  DsAlertDialogMedia,
  DsAlertDialogTitle,
  DsAlertDialogTrigger,
  DsAvatar,
  DsAvatarBadge,
  DsAvatarFallback,
  DsAvatarGroup,
  DsAvatarGroupCount,
  DsAvatarImage,
  DsBadge,
  DsBox,
  DsBreadcrumb,
  DsBreadcrumbItem,
  DsBreadcrumbLink,
  DsBreadcrumbList,
  DsBreadcrumbPage,
  DsBreadcrumbSeparator,
  DsButton,
  DsCalendar,
  DsCheckbox,
  DsCombobox,
  type DsComboboxOption,
  DsCommand,
  DsCommandDialog,
  DsCommandEmpty,
  DsCommandGroup,
  DsCommandInput,
  DsCommandItem,
  DsCommandList,
  DsCommandSeparator,
  DsCommandShortcut,
  DsDataTable,
  DsDatePicker,
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
  DsEmpty,
  DsEmptyContent,
  DsEmptyDescription,
  DsEmptyHeader,
  DsEmptyMedia,
  DsEmptyTitle,
  DsErrorMessage,
  DsField,
  DsFieldGroup,
  DsFieldset,
  DsForm,
  DsFormCheckbox,
  DsFormCombobox,
  DsFormDatePicker,
  DsFormInput,
  DsFormRadioGroup,
  DsFormSelect,
  DsFormSwitch,
  DsFormTextarea,
  DsInput,
  DsLabel,
  DsLegend,
  DsLoading,
  DsPageHeader,
  DsPopover,
  DsPopoverContent,
  DsPopoverDescription,
  DsPopoverHeader,
  DsPopoverTitle,
  DsPopoverTrigger,
  DsRadioGroup,
  DsRadioGroupItem,
  DsSelect,
  DsSelectContent,
  DsSelectGroup,
  DsSelectItem,
  DsSelectLabel,
  DsSelectSeparator,
  DsSelectTrigger,
  DsSelectValue,
  DsSeparator,
  DsSheet,
  DsSheetClose,
  DsSheetContent,
  DsSheetDescription,
  DsSheetFooter,
  DsSheetHeader,
  DsSheetTitle,
  DsSheetTrigger,
  DsSkeleton,
  DsSwitch,
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
import { cn } from "@/src/lib/utils";
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
  bio: z.string().max(160, "Keep it under 160 characters"),
  role: z.string().min(1, "Pick a role"),
  framework: z.string({ error: "Pick a framework" }),
  plan: z.enum(["free", "pro", "team"], { error: "Choose a plan" }),
  birthday: z
    .date({ error: "Pick your birthday" })
    .refine((date) => date < new Date(), "Birthday must be in the past"),
  newsletter: z.boolean(),
  terms: z.boolean().refine(Boolean, "You must accept the terms"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "owner", label: "Owner (only one allowed)", disabled: true },
];

const planOptions = [
  { value: "free", label: "Free", description: "Up to 3 projects." },
  { value: "pro", label: "Pro", description: "Unlimited projects and priority support." },
  { value: "team", label: "Team", description: "Everything in Pro, plus shared workspaces." },
];

const birthdayStartMonth = new Date(1940, 0);
const birthdayEndMonth = new Date(2030, 11);

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

const frameworks: DsComboboxOption[] = [
  { value: "next", label: "Next.js", keywords: ["react", "vercel"] },
  { value: "remix", label: "Remix", keywords: ["react"] },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { value: "angular", label: "Angular", disabled: true },
];

/* Color swatches — class names are written out in full so Tailwind generates them. */
const surfaceTokens = [
  { name: "background", className: "bg-background" },
  { name: "card", className: "bg-card" },
  { name: "popover", className: "bg-popover" },
  { name: "muted", className: "bg-muted" },
  { name: "secondary", className: "bg-secondary" },
  { name: "accent", className: "bg-accent" },
  { name: "border", className: "bg-border" },
  { name: "input", className: "bg-input" },
];

const textTokens = [
  { name: "heading", className: "text-heading" },
  { name: "foreground", className: "text-foreground" },
  { name: "foreground-secondary", className: "text-foreground-secondary" },
  { name: "muted-foreground", className: "text-muted-foreground" },
  { name: "foreground-muted", className: "text-foreground-muted" },
];

const intentTokens = [
  {
    name: "primary",
    solid: "bg-primary text-primary-foreground",
    soft: "border-primary-border bg-primary-soft text-primary-soft-foreground",
  },
  {
    name: "tertiary",
    solid: "bg-tertiary text-tertiary-foreground",
    soft: "border-transparent bg-tertiary-soft text-tertiary-soft-foreground",
  },
  {
    name: "success",
    solid: "bg-success text-success-foreground",
    soft: "border-success-border bg-success-soft text-success-soft-foreground",
  },
  {
    name: "warning",
    solid: "bg-warning text-warning-foreground",
    soft: "border-warning-border bg-warning-soft text-warning-soft-foreground",
  },
  {
    name: "info",
    solid: "bg-info text-info-foreground",
    soft: "border-info-border bg-info-soft text-info-soft-foreground",
  },
  {
    name: "destructive",
    solid: "bg-destructive text-destructive-foreground",
    soft: "border-destructive-border bg-destructive-soft text-destructive-soft-foreground",
  },
];

const brandScale = [
  ["50", "bg-brand-50"],
  ["100", "bg-brand-100"],
  ["200", "bg-brand-200"],
  ["300", "bg-brand-300"],
  ["400", "bg-brand-400"],
  ["500", "bg-brand-500"],
  ["600", "bg-brand-600"],
  ["700", "bg-brand-700"],
  ["800", "bg-brand-800"],
  ["900", "bg-brand-900"],
  ["950", "bg-brand-950"],
] as const;

const violetScale = [
  ["50", "bg-accent-violet-50"],
  ["100", "bg-accent-violet-100"],
  ["200", "bg-accent-violet-200"],
  ["300", "bg-accent-violet-300"],
  ["400", "bg-accent-violet-400"],
  ["500", "bg-accent-violet-500"],
  ["600", "bg-accent-violet-600"],
  ["700", "bg-accent-violet-700"],
  ["800", "bg-accent-violet-800"],
  ["900", "bg-accent-violet-900"],
  ["950", "bg-accent-violet-950"],
] as const;

const baseScale = [
  ["0", "bg-base-0"],
  ["50", "bg-base-50"],
  ["100", "bg-base-100"],
  ["200", "bg-base-200"],
  ["300", "bg-base-300"],
  ["400", "bg-base-400"],
  ["500", "bg-base-500"],
  ["600", "bg-base-600"],
  ["700", "bg-base-700"],
  ["800", "bg-base-800"],
  ["900", "bg-base-900"],
  ["950", "bg-base-950"],
] as const;

const chartTokens = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
];

const ColorScale = ({ label, scale }: { label: string; scale: readonly (readonly [string, string])[] }) => (
  <div className="flex flex-col gap-2">
    <DsTypography variant="caption">{label}</DsTypography>
    <div className="grid grid-cols-6 overflow-hidden rounded-xl border border-border sm:grid-cols-12">
      {scale.map(([step, className]) => (
        <div key={step} className="flex flex-col">
          <div className={cn("h-12", className)} />
          <span className="bg-card py-1 text-center font-mono text-[10px] text-muted-foreground">{step}</span>
        </div>
      ))}
    </div>
  </div>
);

const sections = [
  ["colors", "Colors"],
  ["typography", "Typography"],
  ["box", "Box"],
  ["buttons", "Buttons"],
  ["badges", "Badges"],
  ["avatar", "Avatar"],
  ["inputs", "Inputs"],
  ["controls", "Switch · Radio · Combobox"],
  ["form", "Form"],
  ["overlays", "Overlays"],
  ["dialogs", "Alert dialog · Sheet · Command"],
  ["empty", "Empty"],
  ["tabs", "Tabs"],
  ["accordion", "Accordion"],
  ["calendar", "Calendar"],
  ["loading", "Loading"],
  ["table", "Table"],
  ["data-table", "Data table"],
  ["rtl", "RTL"],
] as const;

/**
 * Reads the current date, so it must not be part of the prerendered static
 * shell: `use(io())` suspends during prerender (Cache Components) and the
 * <Suspense> fallback is shipped instead.
 */
function CalendarDemo() {
  use(io());

  const [date, setDate] = useState<Date | undefined>(() => new Date());
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = new Date();
    return {
      from,
      to: new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6),
    };
  });
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [today] = useState(() => new Date());

  return (
    <>
      <div className="flex flex-wrap items-start gap-6">
        <Row label='mode="single"'>
          <DsBox variant="card" className="overflow-hidden">
            <DsCalendar mode="single" selected={date} onSelect={setDate} />
          </DsBox>
        </Row>

        <Row label='mode="range" · numberOfMonths={2}'>
          <DsBox variant="card" className="overflow-hidden">
            <DsCalendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ before: today }}
            />
          </DsBox>
        </Row>

        <Row label='captionLayout="dropdown"'>
          <DsBox variant="card" className="overflow-hidden">
            <DsCalendar
              mode="single"
              captionLayout="dropdown"
              selected={date}
              onSelect={setDate}
            />
          </DsBox>
        </Row>
      </div>

      <Row label="Date picker">
        <DsField className="w-64">
          <DsLabel htmlFor="kit-birthday">Birthday</DsLabel>
          <DsPopover open={pickerOpen} onOpenChange={setPickerOpen}>
            <DsPopoverTrigger asChild>
              <DsButton
                id="kit-birthday"
                variant="outline"
                className="w-full justify-between font-normal"
              >
                <span
                  className={birthday ? undefined : "text-muted-foreground"}
                >
                  {birthday ? birthday.toLocaleDateString() : "Select date"}
                </span>
                <CalendarIcon className="text-muted-foreground" />
              </DsButton>
            </DsPopoverTrigger>
            <DsPopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <DsCalendar
                mode="single"
                captionLayout="dropdown"
                selected={birthday}
                defaultMonth={birthday}
                onSelect={(d) => {
                  setBirthday(d);
                  setPickerOpen(false);
                }}
              />
            </DsPopoverContent>
          </DsPopover>
        </DsField>
      </Row>
    </>
  );
}

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

  // Controls
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState("pro");
  const [framework, setFramework] = useState<string | undefined>("next");

  // Command palette (⌘K / Ctrl+K)
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Data table
  const [tableLoading, setTableLoading] = useState(false);

  // Form
  const form = useAppForm(profileSchema, {
    fullName: "",
    email: "",
    bio: "",
    role: "",
    newsletter: true,
    terms: false,
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState<ProfileFormData | null>(null);
  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSubmitted(data);
    toast.success(`Saved ${data.fullName}`);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      {/* Header: DsPageHeader + DsBreadcrumb */}
      <DsPageHeader
        title="UI kit"
        description={
          <>
            Every component in <code className="font-mono">src/components</code>, in one place.
          </>
        }
        breadcrumb={
          <DsBreadcrumb>
            <DsBreadcrumbList>
              <DsBreadcrumbItem>
                <DsBreadcrumbLink asChild>
                  <Link href="/" className="inline-flex items-center gap-1">
                    <Home className="size-3.5" /> Home
                  </Link>
                </DsBreadcrumbLink>
              </DsBreadcrumbItem>
              <DsBreadcrumbSeparator />
              <DsBreadcrumbItem>
                <DsBreadcrumbLink href="#">Docs</DsBreadcrumbLink>
              </DsBreadcrumbItem>
              <DsBreadcrumbSeparator />
              <DsBreadcrumbItem>
                <DsBreadcrumbPage>UI kit</DsBreadcrumbPage>
              </DsBreadcrumbItem>
            </DsBreadcrumbList>
          </DsBreadcrumb>
        }
        actions={
          <>
            <DsButton variant="outline" onClick={() => setCommandOpen(true)}>
              <Search /> Search
              <kbd className="ms-2 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                Ctrl K
              </kbd>
            </DsButton>
            <DsButton variant="outline" onClick={toggleTheme}>
              Theme: {theme}
            </DsButton>
          </>
        }
      />

      <nav className="flex flex-wrap gap-1.5">
        {sections.map(([id, label]) => (
          <DsBadge key={id} variant="outline" asChild>
            <a href={`#${id}`}>{label}</a>
          </DsBadge>
        ))}
      </nav>

      {/* Colors */}
      <Section
        id="colors"
        title="Colors"
        description="Semantic tokens switch with the theme — toggle it to compare. Text-on-color pairs meet WCAG AA in both themes."
      >
        <Row label="Surfaces">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {surfaceTokens.map((token) => (
              <div key={token.name} className="flex flex-col gap-1.5">
                <div className={cn("h-14 rounded-lg border border-border", token.className)} />
                <span className="font-mono text-xs text-muted-foreground">{token.name}</span>
              </div>
            ))}
          </div>
        </Row>

        <Row label="Text">
          <div className="flex w-full flex-wrap gap-x-6 gap-y-2">
            {textTokens.map((token) => (
              <span key={token.name} className={cn("text-sm font-medium", token.className)}>
                {token.name}
              </span>
            ))}
          </div>
        </Row>

        <Row label="Intents · solid / soft">
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {intentTokens.map((token) => (
              <div key={token.name} className="overflow-hidden rounded-xl border border-border">
                <div className={cn("flex h-12 items-center px-3 text-sm font-medium", token.solid)}>
                  {token.name}
                </div>
                <div className={cn("flex h-12 items-center border-t px-3 text-sm font-medium", token.soft)}>
                  {token.name}-soft
                </div>
              </div>
            ))}
          </div>
        </Row>

        <ColorScale label="brand-*" scale={brandScale} />
        <ColorScale label="accent-violet-*" scale={violetScale} />
        <ColorScale label="base-* (neutral)" scale={baseScale} />

        <div className="grid gap-6 md:grid-cols-2">
          <Row label="chart-1 … chart-8">
            <div className="flex h-12 w-full overflow-hidden rounded-xl">
              {chartTokens.map((className) => (
                <div key={className} className={cn("flex-1", className)} />
              ))}
            </div>
          </Row>
          <Row label="bg-brand-gradient">
            <div className="flex h-12 w-full items-center rounded-xl bg-brand-gradient px-4 text-sm font-medium text-white">
              Brand gradient
            </div>
          </Row>
        </div>
      </Section>

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
            <DsTypography variant="bodySmall">
              shadow=&quot;sm&quot;
            </DsTypography>
          </DsBox>
          <DsBox variant="card" padding="md" shadow="md">
            <DsTypography variant="bodySmall">
              shadow=&quot;md&quot; (or shadow)
            </DsTypography>
          </DsBox>
          <DsBox variant="card" padding="md" shadow="lg">
            <DsTypography variant="bodySmall">
              shadow=&quot;lg&quot;
            </DsTypography>
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
          <DsBadge variant="brand">Brand</DsBadge>
          <DsBadge variant="tertiary">Tertiary</DsBadge>
          <DsBadge variant="success">Success</DsBadge>
          <DsBadge variant="warning">Warning</DsBadge>
          <DsBadge variant="info">Info</DsBadge>
          <DsBadge variant="destructive">Destructive</DsBadge>
          <DsBadge variant="outline">Outline</DsBadge>
          <DsBadge variant="ghost">Ghost</DsBadge>
          <DsBadge variant="link">Link</DsBadge>
          <DsBadge>
            <Bell /> With icon
          </DsBadge>
        </Row>
      </Section>

      {/* Avatar */}
      <Section id="avatar" title="DsAvatar" description="Image with fallback initials, sizes, status badge and stacked groups.">
        <Row label="size · fallback">
          <DsAvatar size="sm">
            <DsAvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <DsAvatarFallback>CN</DsAvatarFallback>
          </DsAvatar>
          <DsAvatar>
            <DsAvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <DsAvatarFallback>CN</DsAvatarFallback>
          </DsAvatar>
          <DsAvatar size="lg">
            <DsAvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <DsAvatarFallback>CN</DsAvatarFallback>
          </DsAvatar>
          <DsAvatar size="lg">
            <DsAvatarFallback>AL</DsAvatarFallback>
          </DsAvatar>
          <DsAvatar size="lg">
            <DsAvatarFallback>MS</DsAvatarFallback>
            <DsAvatarBadge className="bg-success" />
          </DsAvatar>
        </Row>
        <Row label="DsAvatarGroup">
          <DsAvatarGroup>
            {["AB", "CD", "EF"].map((initials) => (
              <DsAvatar key={initials}>
                <DsAvatarFallback>{initials}</DsAvatarFallback>
              </DsAvatar>
            ))}
            <DsAvatarGroupCount>+5</DsAvatarGroupCount>
          </DsAvatarGroup>
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

      {/* Switch · Radio · Combobox */}
      <Section id="controls" title="DsSwitch · DsRadioGroup · DsCombobox">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <DsTypography variant="caption">DsSwitch</DsTypography>
            <div className="flex items-center gap-3">
              <DsSwitch id="kit-notifications" checked={notifications} onCheckedChange={setNotifications} />
              <DsLabel htmlFor="kit-notifications">Email notifications</DsLabel>
            </div>
            <div className="flex items-center gap-3">
              <DsSwitch id="kit-switch-sm" size="sm" defaultChecked />
              <DsLabel htmlFor="kit-switch-sm">Small</DsLabel>
            </div>
            <div className="flex items-center gap-3">
              <DsSwitch id="kit-switch-disabled" disabled />
              <DsLabel htmlFor="kit-switch-disabled">Disabled</DsLabel>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DsTypography variant="caption">DsRadioGroup</DsTypography>
            <DsRadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
              {[
                ["free", "Free"],
                ["pro", "Pro"],
                ["team", "Team"],
              ].map(([value, label]) => (
                <div key={value} className="flex items-center gap-3">
                  <DsRadioGroupItem value={value} id={`kit-plan-${value}`} />
                  <DsLabel htmlFor={`kit-plan-${value}`}>{label}</DsLabel>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <DsRadioGroupItem value="enterprise" id="kit-plan-enterprise" disabled />
                <DsLabel htmlFor="kit-plan-enterprise">Enterprise (disabled)</DsLabel>
              </div>
            </DsRadioGroup>
          </div>

          <div className="flex flex-col gap-4">
            <DsTypography variant="caption">DsCombobox (searchable select)</DsTypography>
            <DsField>
              <DsLabel htmlFor="kit-framework">Framework</DsLabel>
              <DsCombobox
                id="kit-framework"
                options={frameworks}
                value={framework}
                onValueChange={setFramework}
                placeholder="Select framework…"
                searchPlaceholder="Search framework…"
              />
              <DsDescription>Try typing “react” or “vue”.</DsDescription>
            </DsField>
            <DsField>
              <DsLabel htmlFor="kit-framework-invalid">Invalid</DsLabel>
              <DsCombobox id="kit-framework-invalid" options={frameworks} invalid />
            </DsField>
          </div>
        </div>
      </Section>

      {/* Form */}
      <Section
        id="form"
        title="DsForm + DsForm* fields"
        description="One zod schema drives every field. Submit empty to see all errors; the first invalid field gets focus."
      >
        <DsForm form={form} onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <DsFormInput name="fullName" label="Full name" placeholder="Ada Lovelace" startIcon={<UserIcon />} />
          <DsFormInput
            name="email"
            type="email"
            label="Email"
            placeholder="ada@example.com"
            description="Used for notifications."
          />
          <DsFormSelect name="role" label="Role" placeholder="Select a role" options={roleOptions} />
          <DsFormCombobox
            name="framework"
            label="Framework"
            options={frameworks}
            placeholder="Select framework…"
            searchPlaceholder="Search framework…"
          />
          <DsFormDatePicker
            name="birthday"
            label="Birthday"
            placeholder="Pick your birthday"
            captionLayout="dropdown"
            startMonth={birthdayStartMonth}
            endMonth={birthdayEndMonth}
          />
          <DsFormTextarea
            name="bio"
            label="Bio"
            placeholder="A few words about you"
            description="Max 160 characters."
            className="sm:row-span-2"
          />
          <DsFormRadioGroup name="plan" label="Plan" options={planOptions} />
          <div className="flex flex-col gap-5 sm:col-span-2">
            <DsFormSwitch
              name="newsletter"
              label="Product newsletter"
              description="One email a month, unsubscribe anytime."
            />
            <DsFormCheckbox name="terms" label="I accept the terms and conditions" />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <DsButton type="submit" loading={saving}>
              Save
            </DsButton>
            <DsButton
              variant="ghost"
              onClick={() => {
                form.reset();
                setSubmitted(null);
              }}
            >
              Reset
            </DsButton>
          </div>
        </DsForm>

        {submitted && (
          <DsBox variant="muted" padding="md">
            <DsTypography variant="caption">Submitted values</DsTypography>
            <pre className="mt-2 overflow-x-auto font-mono text-xs text-foreground">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </DsBox>
        )}

        <Row label="DsDatePicker (standalone)">
          <DsDatePicker className="w-64" />
        </Row>
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

      {/* Alert dialog · Sheet · Command */}
      <Section
        id="dialogs"
        title="DsAlertDialog · DsSheet · DsCommand"
        description="Confirmations, side panels and a ⌘K / Ctrl+K command palette."
      >
        <Row label="DsAlertDialog">
          <DsAlertDialog>
            <DsAlertDialogTrigger asChild>
              <DsButton variant="outline">Confirm action</DsButton>
            </DsAlertDialogTrigger>
            <DsAlertDialogContent>
              <DsAlertDialogHeader>
                <DsAlertDialogTitle>Publish changes?</DsAlertDialogTitle>
                <DsAlertDialogDescription>Your changes will be visible to everyone.</DsAlertDialogDescription>
              </DsAlertDialogHeader>
              <DsAlertDialogFooter>
                <DsAlertDialogCancel>Cancel</DsAlertDialogCancel>
                <DsAlertDialogAction onClick={() => toast.success("Published")}>Publish</DsAlertDialogAction>
              </DsAlertDialogFooter>
            </DsAlertDialogContent>
          </DsAlertDialog>

          <DsAlertDialog>
            <DsAlertDialogTrigger asChild>
              <DsButton variant="danger">
                <Trash2 /> Delete project
              </DsButton>
            </DsAlertDialogTrigger>
            <DsAlertDialogContent size="sm">
              <DsAlertDialogHeader>
                <DsAlertDialogMedia className="bg-destructive-soft text-destructive">
                  <TriangleAlert />
                </DsAlertDialogMedia>
                <DsAlertDialogTitle>Delete this project?</DsAlertDialogTitle>
                <DsAlertDialogDescription>This can’t be undone.</DsAlertDialogDescription>
              </DsAlertDialogHeader>
              <DsAlertDialogFooter>
                <DsAlertDialogCancel>Cancel</DsAlertDialogCancel>
                <DsAlertDialogAction variant="danger" onClick={() => toast.error("Project deleted")}>
                  Delete
                </DsAlertDialogAction>
              </DsAlertDialogFooter>
            </DsAlertDialogContent>
          </DsAlertDialog>
        </Row>

        <Row label="DsSheet · side">
          {(["right", "left", "bottom"] as const).map((side) => (
            <DsSheet key={side}>
              <DsSheetTrigger asChild>
                <DsButton variant="outline">
                  <SlidersHorizontal /> {side}
                </DsButton>
              </DsSheetTrigger>
              <DsSheetContent side={side}>
                <DsSheetHeader>
                  <DsSheetTitle>Filters</DsSheetTitle>
                  <DsSheetDescription>Narrow down the results.</DsSheetDescription>
                </DsSheetHeader>
                <div className="flex flex-col gap-4 px-4">
                  <DsField>
                    <DsLabel htmlFor={`sheet-search-${side}`}>Keyword</DsLabel>
                    <DsInput id={`sheet-search-${side}`} placeholder="Search…" startIcon={<Search />} />
                  </DsField>
                  <DsField>
                    <DsLabel htmlFor={`sheet-framework-${side}`}>Framework</DsLabel>
                    <DsCombobox id={`sheet-framework-${side}`} options={frameworks} />
                  </DsField>
                  <div className="flex items-center gap-3">
                    <DsSwitch id={`sheet-active-${side}`} defaultChecked />
                    <DsLabel htmlFor={`sheet-active-${side}`}>Active only</DsLabel>
                  </div>
                </div>
                <DsSheetFooter>
                  <DsSheetClose asChild>
                    <DsButton onClick={() => toast("Filters applied")}>Apply</DsButton>
                  </DsSheetClose>
                  <DsSheetClose asChild>
                    <DsButton variant="outline">Cancel</DsButton>
                  </DsSheetClose>
                </DsSheetFooter>
              </DsSheetContent>
            </DsSheet>
          ))}
        </Row>

        <Row label="DsCommand (inline)">
          <DsCommand className="w-full max-w-sm rounded-xl border border-border shadow-card-sm">
            <DsCommandInput placeholder="Type a command…" />
            <DsCommandList>
              <DsCommandEmpty>No results.</DsCommandEmpty>
              <DsCommandGroup heading="Suggestions">
                <DsCommandItem>
                  <CalendarIcon /> Calendar
                </DsCommandItem>
                <DsCommandItem>
                  <Users /> Team
                </DsCommandItem>
              </DsCommandGroup>
              <DsCommandSeparator />
              <DsCommandGroup heading="Settings">
                <DsCommandItem>
                  <UserIcon /> Profile <DsCommandShortcut>⌘P</DsCommandShortcut>
                </DsCommandItem>
                <DsCommandItem>
                  <Settings /> Settings <DsCommandShortcut>⌘S</DsCommandShortcut>
                </DsCommandItem>
              </DsCommandGroup>
            </DsCommandList>
          </DsCommand>
        </Row>

        <Row label="DsCommandDialog">
          <DsButton variant="outline" onClick={() => setCommandOpen(true)}>
            <Search /> Open command palette
          </DsButton>
          <DsTypography variant="caption">or press Ctrl+K / ⌘K anywhere on this page</DsTypography>
        </Row>
        <DsCommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
          <DsCommand>
            <DsCommandInput placeholder="Jump to a section…" />
            <DsCommandList>
              <DsCommandEmpty>No results.</DsCommandEmpty>
              <DsCommandGroup heading="Sections">
                {sections.map(([id, label]) => (
                  <DsCommandItem
                    key={id}
                    onSelect={() => {
                      setCommandOpen(false);
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {label}
                  </DsCommandItem>
                ))}
              </DsCommandGroup>
              <DsCommandSeparator />
              <DsCommandGroup heading="Actions">
                <DsCommandItem
                  onSelect={() => {
                    toggleTheme();
                    setCommandOpen(false);
                  }}
                >
                  <Settings /> Toggle theme
                </DsCommandItem>
              </DsCommandGroup>
            </DsCommandList>
          </DsCommand>
        </DsCommandDialog>
      </Section>

      {/* Empty */}
      <Section id="empty" title="DsEmpty" description="Empty states for lists, searches and first-run screens.">
        <div className="grid gap-4 md:grid-cols-2">
          <DsEmpty className="border border-dashed border-border">
            <DsEmptyHeader>
              <DsEmptyMedia variant="icon">
                <FolderOpen />
              </DsEmptyMedia>
              <DsEmptyTitle>No projects yet</DsEmptyTitle>
              <DsEmptyDescription>Create your first project to get started.</DsEmptyDescription>
            </DsEmptyHeader>
            <DsEmptyContent>
              <DsButton onClick={() => toast("Create project")}>
                <Plus /> New project
              </DsButton>
            </DsEmptyContent>
          </DsEmpty>

          <DsEmpty className="border border-dashed border-border">
            <DsEmptyHeader>
              <DsEmptyMedia>
                <DsAvatarGroup>
                  {["AB", "CD", "EF"].map((initials) => (
                    <DsAvatar key={initials} size="lg">
                      <DsAvatarFallback>{initials}</DsAvatarFallback>
                    </DsAvatar>
                  ))}
                </DsAvatarGroup>
              </DsEmptyMedia>
              <DsEmptyTitle>No team members</DsEmptyTitle>
              <DsEmptyDescription>Invite people to collaborate on this workspace.</DsEmptyDescription>
            </DsEmptyHeader>
            <DsEmptyContent>
              <DsButton variant="outline" onClick={() => toast("Invite sent")}>
                <Users /> Invite members
              </DsButton>
            </DsEmptyContent>
          </DsEmpty>
        </div>
      </Section>

      {/* Calendar */}
      <Section
        id="calendar"
        title="DsCalendar"
        description='react-day-picker. mode="single" | "range" | "multiple", captionLayout="dropdown", date picker = DsPopover + DsCalendar.'
      >
        <Suspense fallback={<DsSkeleton className="h-80 w-full" />}>
          <CalendarDemo />
        </Suspense>
      </Section>

      {/* Accordion */}
      <Section
        id="accordion"
        title="DsAccordion"
        description='type="single" (one open at a time, collapsible) or type="multiple".'
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Row label='variant="default" · type="single"'>
            <DsAccordion
              type="single"
              collapsible
              defaultValue="shipping"
              className="w-full"
            >
              <DsAccordionItem value="shipping">
                <DsAccordionTrigger>
                  How long does shipping take?
                </DsAccordionTrigger>
                <DsAccordionContent>
                  Orders ship within 2 business days and usually arrive in 3–5
                  days.
                </DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="returns">
                <DsAccordionTrigger>
                  What is your return policy?
                </DsAccordionTrigger>
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
            <DsAccordion
              type="multiple"
              variant="card"
              defaultValue={["account"]}
              className="w-full"
            >
              <DsAccordionItem value="account">
                <DsAccordionTrigger>Account settings</DsAccordionTrigger>
                <DsAccordionContent>
                  Manage your name, email and password.
                </DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="notifications">
                <DsAccordionTrigger>Notifications</DsAccordionTrigger>
                <DsAccordionContent>
                  Choose which emails and alerts you receive.
                </DsAccordionContent>
              </DsAccordionItem>
              <DsAccordionItem value="billing">
                <DsAccordionTrigger>Billing</DsAccordionTrigger>
                <DsAccordionContent>
                  Update your payment method and view invoices.
                </DsAccordionContent>
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
