# SmartGrow Design System & Architecture Guide

Welcome to the **SmartGrow** frontend design and component architecture guide. This document explains how the theme tokens, directory structure, ShadCN primitives, and reusable application components are organized and how to use, reuse, and extend them.

> [!IMPORTANT]
> **STRICT COMPONENT REUSE RULE FOR ALL DEVELOPERS & AI AGENTS**  
> Whenever you build a feature, form, or dashboard page, you **MUST ALWAYS REUSE** existing components from `@/components/atoms/application` (`ApplicationTable`, `ApplicationPagination`, `ApplicationDialog`) and `packages/ui/src/components/` (`Button`, `Input`, `Dialog`, `Badge`, `Checkbox`, etc.).  
> **Writing custom `<table>` implementations, custom paginators, or bespoke modals is strictly prohibited.**

---

## 1. Directory & Component Architecture

The project follows an **Atomic Component & Modular Structure** located in `apps/web/src/`:

```
apps/web/src/
├── components/
│   ├── atoms/
│   │   └── application/         # Core reusable SmartGrow application atoms
│   │       ├── ApplicationPagination.tsx
│   │       ├── ApplicationTable.tsx
│   │       ├── ApplicationDialog.tsx
│   │       └── index.ts
│   ├── molecules/
│   │   └── skeleton/            # Skeleton loaders & composite UI molecules
│   │       ├── TableSkeleton.tsx
│   │       └── index.ts
│   ├── organisms/               # Complex feature-level sections & forms
│   ├── pages/                   # Route-level page components
│   └── templates/               # Layout templates & wrappers
├── config/                      # Application configs, constants, & navigation
├── context/                     # Shared React context definitions
├── hooks/                       # Custom hooks (e.g., useTheme)
├── interface/                   # TypeScript interfaces & API contracts
├── middleware/                  # Route & auth middleware
├── providers/                   # Context providers (e.g., ThemeProvider)
├── services/                    # API client services & query handlers
├── types/                       # Shared type definitions
└── utils/                       # Utility helper functions
```

---

## 2. Design System & Theme Tokens

All design tokens are centralized in:
👉 [`packages/ui/src/styles/globals.css`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/packages/ui/src/styles/globals.css)

### 2.1 CSS Variables & Palette Tokens

- **Brand Green OKLCH Palette**:
  - Light mode: `--primary: oklch(0.57 0.16 130)`
  - Dark mode: `--primary: oklch(0.62 0.16 130)`
- **Surfaces & Backgrounds**:
  - Light mode: `--background: oklch(0.99 0 0)`, `--card: oklch(1 0 0)`
  - Dark mode: `--background: oklch(0.14 0.01 130)`, `--card: oklch(0.18 0.015 130)`
- **Admin Dashboard Stat Badges**:
  - Green / Active: `--admin-badge-green-bg`, `--admin-badge-green-text`, `--admin-badge-green-border`
  - Pending: `--admin-stat-pending-bg`, `--admin-stat-pending-text`, `--admin-stat-pending-border`
  - Suspended / Warning: `--admin-stat-suspended-bg`, `--admin-stat-suspended-text`, `--admin-stat-suspended-border`

### 2.2 Button Hierarchy System

Always use the predefined button utility classes with clear intent:

| Class            | Appearance                                         | Usage                                      |
| :--------------- | :------------------------------------------------- | :----------------------------------------- |
| `.btn-primary`   | **Brand Green (`#7EA817` Light / `#7C9A3D` Dark)** | Primary action / form submit / CTAs        |
| `.btn-secondary` | Subtle gray / dark background                      | Secondary action / alternatives            |
| `.btn-outline`   | Bordered with hover state                          | Filters, search actions, bordered triggers |
| `.btn-ghost`     | Transparent background                             | Dismiss, cancel, modal close, icon buttons |

---

## 3. How to Use & Reuse Application Components

### 3.1 `ApplicationTable`

A fully-featured data table supporting column sorting, client/server pagination, multi-select rows, expandable detail drawers, search filtering, and skeleton loading.

**Import**:

```tsx
import { ApplicationTable, type Column } from "@/components/atoms/application"
```

**Usage Example**:

```tsx
interface Item {
  id: string
  name: string
  category: string
}

const columns: Column<Item>[] = [
  { header: "Name", accessorKey: "name", sort: true },
  { header: "Category", accessorKey: "category", sort: true },
]

;<ApplicationTable
  data={data}
  columns={columns}
  showSearch
  showSelection
  showSerialNo
  searchKeys={["name", "category"]}
  isLoading={isLoading}
  onRowClick={(item) => console.log(item)}
  pagination={{
    total: 100,
    page: 1,
    pageSize: 10,
    onPageChange: (p) => setPage(p),
    onPageSizeChange: (s) => setPageSize(s),
  }}
/>
```

---

### 3.2 `ApplicationPagination`

Standalone pagination bar with responsive page jump buttons, page size selector dropdown, and record counts.

**Import**:

```tsx
import { ApplicationPagination } from "@/components/atoms/application"
```

**Usage Example**:

```tsx
<ApplicationPagination
  total={totalRecords}
  page={currentPage}
  pageSize={pageSize}
  onPageChange={(page) => setCurrentPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
  showPageSize={true}
/>
```

---

### 3.3 `ApplicationDialog`

Standardized modal dialog wrapper with header, customizable body, and action footer.

**Import**:

```tsx
import { ApplicationDialog } from "@/components/atoms/application"
```

**Usage Example**:

```tsx
<ApplicationDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title={(item) => (item ? `Edit ${item.name}` : "Create Item")}
  description={() => "Fill out the fields below"}
  footer={() => (
    <div className="flex justify-end gap-2 border-t border-border p-4">
      <button onClick={() => setIsOpen(false)} className="btn-ghost px-4 py-2">
        Cancel
      </button>
      <button onClick={handleSave} className="btn-primary px-4 py-2">
        Save
      </button>
    </div>
  )}
>
  {(item) => <div className="p-4">{/* Dialog content */}</div>}
</ApplicationDialog>
```

---

## 4. Directional View Transitions Theme Switcher

Theme switching uses the native `document.startViewTransition` API with a directional slide reveal.

**Usage**:

```tsx
import { useTheme } from "@/hooks/useTheme"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="btn-ghost p-2"
    >
      Toggle Theme ({theme})
    </button>
  )
}
```

---

## 5. Adding New ShadCN Primitives

Whenever a new primitive UI component is required:

1. **Install into `@workspace/ui`**:
   ```bash
   cd packages/ui
   npx shadcn@latest add <component-name> -y
   ```
2. **Import into your feature**:
   ```tsx
   import {
     Popover,
     PopoverContent,
     PopoverTrigger,
   } from "@workspace/ui/components/popover"
   ```
