# QuickProSite - Component Library Specification

**Purpose:** Developer-ready specifications for building reusable React components.
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Radix UI, Framer Motion
**Status:** Ready for implementation

---

## 1. Component Architecture

### 1.1 Design Principles

1. **Atomic Design:** Build from atoms (Button) → molecules (SearchInput) → organisms (CommandPalette)
2. **Composition Over Configuration:** Prefer composable primitives over mega-props
3. **Accessibility First:** Use Radix UI primitives, ensure keyboard nav + screen reader support
4. **Type-Safe:** Full TypeScript with strict mode, no `any` types
5. **Performance:** Lazy load heavy components, memoize where needed

### 1.2 File Structure

```
components/
├── ui/                     # Atomic components (shadcn/ui style)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── toast.tsx
│   └── ...
├── compound/               # Composed components
│   ├── command-palette.tsx
│   ├── floating-action-button.tsx
│   ├── site-card.tsx
│   ├── inline-editor.tsx
│   └── ...
├── layout/                 # Layout components
│   ├── header.tsx
│   ├── dashboard-grid.tsx
│   └── ...
└── animations/             # Framer Motion variants
    ├── fade-up.ts
    ├── slide-in.ts
    └── ...
```

### 1.3 Naming Conventions

- **Component files:** kebab-case (`button.tsx`, `command-palette.tsx`)
- **Component names:** PascalCase (`Button`, `CommandPalette`)
- **Props interfaces:** `{ComponentName}Props` (`ButtonProps`)
- **Variants:** String unions (`variant: "primary" | "secondary"`)

---

## 2. Atomic Components (UI Primitives)

### 2.1 Button

**File:** `components/ui/button.tsx`

#### API

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  // Implementation
}
```

#### Variants

**Primary (Gradient):**
```tsx
className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 hover:scale-105 active:scale-98"
```

**Secondary (Ghost):**
```tsx
className="border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
```

**Ghost (Minimal):**
```tsx
className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
```

**Danger:**
```tsx
className="bg-red-600 text-white hover:bg-red-500"
```

#### Sizes

```tsx
const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};
```

#### States

**Loading:**
```tsx
{loading && (
  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)}
```

#### Usage Examples

```tsx
// Primary CTA
<Button variant="primary" size="lg" fullWidth>
  Generate My Site ✨
</Button>

// Secondary action
<Button variant="secondary" size="md" icon={<EditIcon />}>
  Edit
</Button>

// Loading state
<Button variant="primary" loading disabled>
  Saving...
</Button>

// Danger action
<Button variant="danger" size="sm">
  Delete Site
</Button>
```

#### Accessibility

- `disabled` attribute when loading or disabled
- `aria-label` for icon-only buttons
- Focus visible (ring-2 ring-cyan-500)
- `type="button"` default (override with `type="submit"` for forms)

---

### 2.2 Input

**File:** `components/ui/input.tsx`

#### API

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  glow?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  leadingIcon,
  trailingIcon,
  glow = false,
  className,
  ...props
}: InputProps) {
  // Implementation
}
```

#### Base Styling

```tsx
const baseClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all";

const glowClasses = glow
  ? "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
  : "focus:border-slate-600";

const errorClasses = error
  ? "border-red-500 focus:ring-red-500/50"
  : "";
```

#### With Icons

```tsx
<div className="relative">
  {leadingIcon && (
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
      {leadingIcon}
    </div>
  )}
  <input className={leadingIcon ? "pl-10" : ""} {...props} />
  {trailingIcon && (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
      {trailingIcon}
    </div>
  )}
</div>
```

#### Error Display

```tsx
{error && (
  <p className="mt-1 text-sm text-red-400" id={`${props.id}-error`}>
    {error}
  </p>
)}
```

#### Usage Examples

```tsx
// Standard input
<Input
  label="Business Name"
  placeholder="Joe's Plumbing"
  required
/>

// With glow
<Input
  glow
  leadingIcon={<SearchIcon />}
  placeholder="Search for your business..."
/>

// Error state
<Input
  label="Email"
  type="email"
  error="Please enter a valid email"
  aria-describedby="email-error"
/>
```

#### Accessibility

- `<label>` element associated with input (via `htmlFor`)
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required="true"`
- Focus visible (ring + border color change)

---

### 2.3 Card

**File:** `components/ui/card.tsx`

#### API

```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  className,
  ...props
}: CardProps) {
  // Implementation
}
```

#### Variants

**Default (Glassmorphic):**
```tsx
className="bg-slate-900/50 backdrop-blur-lg border border-slate-800/50 rounded-2xl"
```

**Glow (Hover):**
```tsx
className="hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all"
```

#### Padding

```tsx
const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};
```

#### Usage Examples

```tsx
// Default card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Card>

// Glow card with hover
<Card variant="glow" hover>
  <SiteCardContent />
</Card>

// No padding (for images)
<Card padding="none">
  <img src="..." alt="..." className="rounded-t-2xl" />
  <div className="p-6">
    <h3>Title</h3>
  </div>
</Card>
```

---

### 2.4 Dialog (Modal)

**File:** `components/ui/dialog.tsx`
**Dependency:** Radix UI Dialog

#### API

```tsx
import * as Dialog from "@radix-ui/react-dialog";

interface DialogContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function DialogContent({
  title,
  description,
  children,
  maxWidth = "md",
}: DialogContentProps) {
  // Implementation
}
```

#### Structure

```tsx
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Open Dialog</button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />

    <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <Dialog.Title className="text-xl font-bold text-slate-100">
        {title}
      </Dialog.Title>

      {description && (
        <Dialog.Description className="text-sm text-slate-400 mt-2">
          {description}
        </Dialog.Description>
      )}

      <div className="mt-6">
        {children}
      </div>

      <Dialog.Close className="absolute top-4 right-4 text-slate-400 hover:text-slate-200">
        <XIcon />
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

#### Animations (with Tailwind)

```css
/* globals.css */
@layer utilities {
  .animate-in {
    animation: slideIn 0.3s ease-out;
  }
  .animate-out {
    animation: slideOut 0.2s ease-in;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

#### Accessibility

- Focus trap (keyboard nav stays within modal)
- ESC key closes modal
- Overlay click closes modal
- Focus returns to trigger on close
- `aria-labelledby` links title to content

---

### 2.5 Toast

**File:** `components/ui/toast.tsx`
**Dependency:** Radix UI Toast OR custom implementation

#### API

```tsx
interface ToastProps {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info" | "loading";
  duration?: number; // milliseconds
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, { ...props, id: Date.now() }]);

    if (props.duration !== Infinity) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== props.id));
      }, props.duration || 3000);
    }
  };

  return { toast, toasts };
}
```

#### Structure

```tsx
<div className="fixed top-4 right-4 z-50 space-y-2">
  {toasts.map((toast) => (
    <div
      key={toast.id}
      className={`
        px-6 py-3 rounded-lg shadow-lg
        ${variantClasses[toast.variant]}
        animate-in slide-in-from-right
      `}
    >
      <div className="flex items-center gap-3">
        <Icon variant={toast.variant} />
        <div>
          <p className="font-medium">{toast.title}</p>
          {toast.description && (
            <p className="text-sm opacity-90">{toast.description}</p>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
```

#### Variants

```tsx
const variantClasses = {
  success: "bg-emerald-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
  loading: "bg-slate-800 text-slate-100",
};
```

#### Usage Examples

```tsx
const { toast } = useToast();

// Success
toast({
  title: "Saved!",
  variant: "success",
  duration: 3000,
});

// Error
toast({
  title: "Failed to save",
  description: "Please try again.",
  variant: "error",
});

// Loading (persistent)
const loadingToast = toast({
  title: "Saving...",
  variant: "loading",
  duration: Infinity,
});
// Later: dismiss by removing from state
```

---

## 3. Compound Components

### 3.1 Command Palette

**File:** `components/compound/command-palette.tsx`
**Dependency:** cmdk (Command Menu by Paco)

#### API

```tsx
interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  // Implementation
}
```

#### Structure

```tsx
import { Command } from "cmdk";

<Command.Dialog
  open={open}
  onOpenChange={onOpenChange}
  className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
>
  <Command.Input
    placeholder="Type a command or search..."
    className="w-full bg-slate-800 border-b border-slate-700 px-6 py-4 text-lg text-slate-100 focus:outline-none"
  />

  <Command.List className="max-h-[400px] overflow-y-auto p-2">
    <Command.Empty className="py-6 text-center text-sm text-slate-400">
      No results found.
    </Command.Empty>

    <Command.Group heading="Quick Actions">
      <Command.Item
        onSelect={() => handleAction("remix")}
        className="flex items-center gap-3 px-6 py-3 text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
      >
        <span className="text-2xl">✨</span>
        <span>Remix Layout</span>
        <kbd className="ml-auto text-xs text-slate-500">R</kbd>
      </Command.Item>
      {/* More items... */}
    </Command.Group>

    <Command.Group heading="AI Tools">
      {/* AI commands... */}
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

#### Keyboard Shortcuts

```tsx
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onOpenChange(!open);
    }
  };

  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, [open, onOpenChange]);
```

#### Usage Example

```tsx
const [commandOpen, setCommandOpen] = useState(false);

<CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
<FloatingActionButton onClick={() => setCommandOpen(true)} />
```

---

### 3.2 Floating Action Button (FAB)

**File:** `components/compound/floating-action-button.tsx`

#### API

```tsx
interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({
  onClick,
  icon = <BoltIcon className="w-6 h-6" />,
  label = "Open command palette",
}: FABProps) {
  // Implementation
}
```

#### Structure

```tsx
<button
  onClick={onClick}
  aria-label={label}
  className="
    fixed bottom-8 right-8 z-40
    w-16 h-16 rounded-full
    bg-gradient-to-br from-cyan-500 to-purple-600
    text-white shadow-2xl shadow-purple-500/50
    hover:scale-110 hover:rotate-12
    active:scale-95
    transition-all duration-200
  "
>
  {icon}
</button>
```

#### With Tooltip (Optional)

```tsx
import * as Tooltip from "@radix-ui/react-tooltip";

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <button>{/* FAB content */}</button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="left" className="bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm">
        Press ⌘K
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
```

---

### 3.3 Site Card (Dashboard)

**File:** `components/compound/site-card.tsx`

#### API

```tsx
interface SiteCardProps {
  site: {
    id: string;
    name: string;
    subdomain: string;
    theme: "blue" | "red" | "green";
    createdAt: string;
  };
  onEdit: (id: string) => void;
  onViewLive: (subdomain: string) => void;
}

export function SiteCard({ site, onEdit, onViewLive }: SiteCardProps) {
  // Implementation
}
```

#### Structure

```tsx
<Card variant="glow" hover className="overflow-hidden">
  {/* Theme color strip */}
  <div className={`h-2 bg-gradient-to-r ${themeGradients[site.theme]}`} />

  <div className="p-6">
    <h3 className="text-lg font-bold text-slate-100 mb-1">
      {site.name}
    </h3>
    <p className="text-sm text-slate-400 font-mono mb-4">
      {site.subdomain}.quickprosite.com
    </p>

    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
      <Button
        variant="secondary"
        size="sm"
        icon={<EditIcon />}
        onClick={() => onEdit(site.id)}
      >
        Edit
      </Button>

      <a
        href={`https://${site.subdomain}.quickprosite.com`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
      >
        View Live
        <ExternalLinkIcon className="w-4 h-4" />
      </a>
    </div>

    <p className="text-xs text-slate-500 mt-4">
      Created {formatDate(site.createdAt)}
    </p>
  </div>
</Card>
```

---

### 3.4 Inline Editor

**File:** `components/compound/inline-editor.tsx`

#### API

```tsx
interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
}

export function InlineEditor({
  value,
  onChange,
  onSave,
  placeholder,
}: InlineEditorProps) {
  // Implementation
}
```

#### Structure

```tsx
const [isEditing, setIsEditing] = useState(false);
const [localValue, setLocalValue] = useState(value);

<div
  className={`
    relative
    ${!isEditing && "hover:border-2 hover:border-dashed hover:border-cyan-500/50 cursor-text"}
  `}
  onClick={() => !isEditing && setIsEditing(true)}
>
  {isEditing ? (
    <>
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleCancel();
          if (e.key === "Enter" && e.metaKey) handleSave();
        }}
        className="outline-none"
      >
        {localValue}
      </div>

      {/* Floating toolbar */}
      <div className="absolute -top-12 left-0 bg-slate-900 border border-slate-700 rounded-lg shadow-xl px-2 py-1 flex items-center gap-2">
        <button onClick={() => document.execCommand("bold")}>
          <BoldIcon />
        </button>
        <button onClick={() => document.execCommand("italic")}>
          <ItalicIcon />
        </button>
        <button onClick={handleAIRewrite}>
          <SparklesIcon />
        </button>
        <button onClick={handleCancel}>
          <XIcon />
        </button>
      </div>
    </>
  ) : (
    <div>{value || placeholder}</div>
  )}
</div>
```

---

## 4. Layout Components

### 4.1 Header

**File:** `components/layout/header.tsx`

#### API

```tsx
interface HeaderProps {
  variant: "landing" | "dashboard" | "editor";
  user?: {
    name: string;
    email: string;
  };
  siteContext?: {
    name: string;
    subdomain: string;
  };
  onSave?: () => void;
  onBack?: () => void;
}
```

#### Variants

**Landing:**
```tsx
<header className="fixed top-0 right-0 p-6 z-10">
  <Link href="/dashboard" className="text-slate-400 hover:text-cyan-400">
    Login to Dashboard →
  </Link>
</header>
```

**Dashboard:**
```tsx
<header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
      QuickProSite
    </Link>
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-400">{user.email}</span>
      <SignOutButton />
    </div>
  </div>
</header>
```

**Editor:**
```tsx
<header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
  <div className="px-6 py-3 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="text-slate-400 hover:text-slate-200">
        ← Back
      </button>
      <span className="text-slate-200 font-semibold">
        Editing: {siteContext.name}
      </span>
    </div>
    <div className="flex items-center gap-4">
      <a href={`https://${siteContext.subdomain}.quickprosite.com`} target="_blank" className="text-cyan-400 hover:text-cyan-300">
        View Live Site →
      </a>
      <Button variant="primary" size="sm" onClick={onSave}>
        Save Changes
      </Button>
    </div>
  </div>
</header>
```

---

### 4.2 Dashboard Grid

**File:** `components/layout/dashboard-grid.tsx`

#### API

```tsx
interface DashboardGridProps {
  sites: Site[];
  onEdit: (id: string) => void;
  onViewLive: (subdomain: string) => void;
}

export function DashboardGrid({ sites, onEdit, onViewLive }: DashboardGridProps) {
  // Implementation
}
```

#### Structure

```tsx
<div className="grid grid-cols-12 gap-4">
  {sites.map((site, index) => {
    const variant = getBentoVariant(index);
    return (
      <div key={site.id} className={variant.gridClass}>
        <SiteCard
          site={site}
          onEdit={onEdit}
          onViewLive={onViewLive}
          showPreview={variant.showPreview}
        />
      </div>
    );
  })}
</div>
```

#### Bento Logic

```tsx
function getBentoVariant(index: number) {
  const patterns = [
    { gridClass: "col-span-8 row-span-2", showPreview: true },  // Large
    { gridClass: "col-span-4", showPreview: false },             // Medium
    { gridClass: "col-span-4", showPreview: false },             // Medium
    { gridClass: "col-span-12", showPreview: true },             // Wide
  ];
  return patterns[index % patterns.length];
}
```

---

## 5. Animation Utilities

### 5.1 Framer Motion Variants

**File:** `components/animations/variants.ts`

```tsx
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const slideIn = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

#### Usage

```tsx
import { motion } from "framer-motion";
import { fadeUp } from "@/components/animations/variants";

<motion.div {...fadeUp}>
  <Card>Content</Card>
</motion.div>
```

---

### 5.2 Loading States

**File:** `components/animations/loading.tsx`

#### Skeleton Loader

```tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-800 rounded ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// Usage
<Skeleton className="h-8 w-48" />  // Header
<Skeleton className="h-4 w-full" /> // Text line
```

#### Spinner

```tsx
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]}`}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
```

---

## 6. Testing Guidelines

### 6.1 Unit Tests (Jest + React Testing Library)

```tsx
// button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### 6.2 Accessibility Tests (axe)

```tsx
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

describe("Button accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 6.3 Visual Regression Tests (Chromatic / Percy)

```tsx
// Use Storybook + Chromatic for visual testing
export default {
  title: "UI/Button",
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary</Button>;
export const Loading = () => <Button loading>Loading</Button>;
export const AllVariants = () => (
  <div className="space-y-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
);
```

---

## 7. Storybook Setup

### 7.1 Installation

```bash
npm install --save-dev @storybook/react @storybook/addon-essentials
npm install --save-dev storybook-tailwind-dark-mode
```

### 7.2 Configuration

```js
// .storybook/main.js
module.exports = {
  stories: ["../components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-essentials",
    "storybook-tailwind-dark-mode",
  ],
  framework: "@storybook/react",
};
```

```js
// .storybook/preview.js
import "../app/globals.css"; // Import Tailwind

export const parameters = {
  darkMode: {
    current: "dark",
    darkClass: "dark",
    lightClass: "light",
    stylePreview: true,
  },
  backgrounds: {
    default: "dark",
    values: [
      { name: "dark", value: "#0a0a0f" },
      { name: "light", value: "#ffffff" },
    ],
  },
};
```

### 7.3 Example Story

```tsx
// components/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Generate My Site ✨",
    variant: "primary",
  },
};

export const Loading: Story = {
  args: {
    children: "Saving...",
    loading: true,
  },
};
```

---

## 8. Performance Optimizations

### 8.1 Code Splitting

```tsx
// Lazy load heavy components
const CommandPalette = dynamic(
  () => import("@/components/compound/command-palette"),
  { ssr: false }
);

const Editor = dynamic(
  () => import("@/components/editor"),
  {
    loading: () => <Skeleton className="h-screen w-full" />,
    ssr: false,
  }
);
```

### 8.2 Memoization

```tsx
// Memoize expensive computations
const SiteCard = memo(function SiteCard({ site, onEdit, onViewLive }) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.site.id === nextProps.site.id;
});

// Memoize callbacks
const handleEdit = useCallback((id: string) => {
  router.push(`/editor/${id}`);
}, [router]);
```

### 8.3 Image Optimization

```tsx
import Image from "next/image";

<Image
  src={site.thumbnail}
  alt={`${site.name} preview`}
  width={640}
  height={360}
  className="rounded-lg"
  placeholder="blur"
  blurDataURL={site.thumbnailBlur}
/>
```

---

## 9. Documentation Standards

### 9.1 Component JSDoc

```tsx
/**
 * Primary button component for CTAs.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" fullWidth>
 *   Generate My Site ✨
 * </Button>
 * ```
 *
 * @see {@link https://www.figma.com/file/xyz | Figma Design}
 */
export function Button({ ... }) {
  // Implementation
}
```

### 9.2 README Template

```md
# Button

Primary interactive element for CTAs and actions.

## Usage

\`\`\`tsx
import { Button } from "@/components/ui/button";

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "primary" \| "secondary" \| "ghost" \| "danger" | "primary" | Visual style |
| size | "sm" \| "md" \| "lg" | "md" | Size variant |
| loading | boolean | false | Show loading spinner |
| fullWidth | boolean | false | Take full width of container |

## Accessibility

- Uses semantic `<button>` element
- Disabled state prevents interaction
- Focus visible with ring indicator
- Screen reader compatible
```

---

## 10. Next Steps

1. **Set up Storybook:** Initialize Storybook with dark mode preset
2. **Build atomic components:** Start with Button, Input, Card (3-5 days)
3. **Build compound components:** Command Palette, Site Card (5-7 days)
4. **Write tests:** Unit tests + accessibility tests (ongoing)
5. **Document in Storybook:** Add stories for all components (ongoing)

---

**Status:** ✅ Complete - Ready for development
**Next Document:** `05-implementation-checklist.md` (Step-by-step build guide)
