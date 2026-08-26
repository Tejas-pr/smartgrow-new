# SmartGrow Developer & Contributor Guide

Welcome to the **SmartGrow** codebase! This document is the comprehensive, end-to-end guide on setting up, building, styling, architecting, and contributing to the application.

> [!CAUTION]
>
> ### 🚨 STRICT RULES FOR ALL AI AGENTS & DEVELOPERS
>
> 1. **SEARCH BEFORE YOU BUILD**: Before creating any new component, utility function, hook, interface, or service, you **MUST FIRST SEARCH AND INSPECT THE CODEBASE** to verify if a matching implementation or pattern already exists. If it exists, you **MUST REUSE IT**.
> 2. **READ DOCS BEFORE CODING**: You **MUST** thoroughly read this guide and [`docs/design-guide.md`](design-guide.md) before writing or modifying code. Never invent ad-hoc folder structures; place every file in its strictly designated directory.
> 3. **MANDATORY COMPONENT REUSE**: Writing duplicate tables, custom pagination bars, or custom modal dialogs is strictly prohibited:
>    - **Tables**: Reuse `ApplicationTable` (`@/components/atoms/application`).
>    - **Pagination**: Reuse `ApplicationPagination` (`@/components/atoms/application`).
>    - **Dialogs**: Reuse `ApplicationDialog` (`@/components/atoms/application`).
>    - **Table Loaders**: Reuse `TableSkeleton` (`@/components/molecules/skeleton`).
>    - **Primitives**: Reuse ShadCN primitives from `@workspace/ui/components/*`.
> 4. **SKELETON LOADING (MANDATORY)**: Every new organism or page section that fetches data **MUST** have a corresponding skeleton loader in `src/components/molecules/skeleton/`. Name it after the component (`ProductCard.tsx` → `ProductCardSkeleton.tsx`) and export from `skeleton/index.ts`.
> 5. **MOBILE RESPONSIVE (MANDATORY)**: Every component, page, and organism **MUST** be fully mobile responsive. Use Tailwind breakpoints mobile-first (`sm:`, `md:`, `lg:`). Wrap `ApplicationTable` in `<div className="w-full overflow-x-auto">`. Never use fixed pixel widths for full-width containers.
> 6. **STYLING & THEME**: Always use the centralized tokens from `packages/ui/src/styles/globals.css`, and use `.btn-primary` (Brand Green `#7EA817` Light / `#7C9A3D` Dark) for primary buttons.
> 7. **AFTER CODING VERIFICATION**: You **MUST** run the full verification pipeline (`npm run typecheck` and `npm run build`). Both commands **MUST EXIT WITH 0 ERRORS** before any task is considered complete.

---

## 📑 Table of Contents

1. [Prerequisites & Getting Started](#1-prerequisites--getting-started)
2. [Turborepo Monorepo Overview](#2-turborepo-monorepo-overview)
3. [Complete Folder Structure & Directory Map (Where Code Goes)](#3-complete-folder-structure--directory-map-where-code-goes)
4. [Atomic Design Hierarchy & Mandatory Component Reuse](#4-atomic-design-hierarchy--mandatory-component-reuse)
5. [Theme System & Styling (Colors, Buttons & View Transitions)](#5-theme-system--styling-colors-buttons--view-transitions)
6. [Adding & Using ShadCN UI Components](#6-adding--using-shadcn-ui-components)
7. [API Layer & State Management (Axios + TanStack Query)](#7-api-layer--state-management-axios--tanstack-query)
8. [Pre-Commit Pipeline (Husky & Lint-Staged)](#8-pre-commit-pipeline-husky--lint-staged)
9. [AI Agent Skills & Antigravity IDE](#9-ai-agent-skills--antigravity-ide)

---

## 1. Prerequisites & Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or higher
- **npm**: `v11.0.0` or higher
- **Git**: Installed and configured

### Installation & Local Setup

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd smartgrow-new
   ```

2. **Install all workspace dependencies**:

   ```bash
   npm install
   ```

   > ℹ️ Running `npm install` automatically triggers the `"prepare": "husky"` script, configuring git pre-commit hooks for quality and type-safety.

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173/` in your browser.

4. **Useful Scripts**:
   - `npm run dev` — Starts all workspaces in dev/watch mode using Turborepo.
   - `npm run build` — Builds all packages and the web application for production.
   - `npm run typecheck` — Runs `tsc --noEmit` across all workspace packages with zero emitted JS.
   - `npm run format` — Formats all codebase files with Prettier.
   - `npm run format:check` — Checks formatting without modifying files.

---

## 2. Turborepo Monorepo Overview

SmartGrow is structured as a **Turborepo** monorepo designed for scale, high caching efficiency, and clean package isolation.

> 📺 **Recommended Watch**: For a complete overview of how Turborepo pipelines, workspace dependencies, and caching work, watch:  
> [**Turborepo Crash Course & Explanation (YouTube)**](https://youtu.be/780Fyv-SAUk)

### Core Workspaces:

- **`apps/web`**: Main React 19 + Vite web client (routing, state, pages, business logic).
- **`packages/ui`**: Shared UI component library, ShadCN primitives, and global CSS design tokens.

---

## 3. Complete Folder Structure & Directory Map (Where Code Goes)

To ensure consistency, every file in `apps/web/src/` has a strictly designated location. Refer to this comprehensive directory mapping:

```
apps/web/src/
├── config/           → Global constants, app settings, environment variables
├── context/          → React Context objects & Context-level state definitions
├── hooks/            → Reusable custom React hooks (UI, event listeners, lifecycle)
├── interface/        → Complex TypeScript interfaces, contracts & prop types
├── middleware/       → Route guards, auth checks, onboarding redirects, permission gates
├── providers/        → Top-level Context Provider wrapper components
├── services/         → Backend API endpoints & Axios HTTP service calls
├── types/            → Global TypeScript type definitions, enums, DTOs & unions
├── utils/            → Pure helper functions, formatting, storage, and Axios instance
└── components/
    ├── atoms/        → Indivisible UI components & atoms/application/
    ├── molecules/    → Functional combinations of atoms & molecules/skeleton/
    ├── organisms/    → Complete feature blocks & forms (organisms/auth/)
    ├── templates/    → Structural layout shells (DashboardLayout, AuthLayout)
    └── pages/        → Minimal route entry points (HomePage, LoginPage)
```

### Detailed Breakdown of Each Directory:

| Directory                       | What Goes Here?                                                                        | Examples                                                                     |
| :------------------------------ | :------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **`src/config/`**               | Runtime constants, site metadata, navigation items, query client defaults, API routes. | `constants.ts`, `routes.config.ts`, `site.ts`                                |
| **`src/context/`**              | Raw React Context definitions and lightweight context state.                           | `AuthContext.ts`, `ThemeContext.ts`, `CartContext.ts`                        |
| **`src/hooks/`**                | Reusable React hooks for UI, viewport, timers, state, or DOM interactions.             | `useTheme.ts`, `useAuth.ts`, `useDebounce.ts`, `useMediaQuery.ts`            |
| **`src/interface/`**            | Complex data models, external API responses, component contract interfaces.            | `user.interface.ts`, `product.interface.ts`, `order.interface.ts`            |
| **`src/middleware/`**           | Route protection, authentication gates, role checks, and onboarding redirect handlers. | `AuthGuard.tsx`, `RoleGuard.tsx`, `onboardingRedirect.ts`                    |
| **`src/providers/`**            | Root context providers that wrap `App.tsx` or page subtrees.                           | `ThemeProvider.tsx`, `AuthProvider.tsx`, `QueryProvider.tsx`                 |
| **`src/services/`**             | API request functions calling backend endpoints via the Axios instance.                | `user.api.ts`, `product.api.ts`, `order.api.ts`, `farm.api.ts`               |
| **`src/types/`**                | Global TypeScript types, union literals, status enums, Zod validator types.            | `auth.types.ts`, `table.types.ts`, `roles.ts`, `api.types.ts`                |
| **`src/utils/`**                | Pure, side-effect-free utility functions, formatters, and client instances.            | `axios.ts`, `localstorage.ts`, `currency.ts`, `date.ts`                      |
| **`src/components/atoms/`**     | Base UI building blocks and the `atoms/application/` component suite.                  | `ApplicationTable.tsx`, `ApplicationPagination.tsx`, `ApplicationDialog.tsx` |
| **`src/components/molecules/`** | Combinations of atoms, data cells, loaders, and `molecules/skeleton/`.                 | `TableSkeleton.tsx`                                                          |
| **`src/components/organisms/`** | Feature-level forms and rich widgets grouped by domain.                                | `organisms/auth/LoginForm.tsx`, `organisms/auth/SignupForm.tsx`              |
| **`src/components/templates/`** | Layout wrappers with sidebars, navbars, and content slots.                             | `DashboardTemplate.tsx`, `AuthTemplate.tsx`                                  |
| **`src/components/pages/`**     | Minimal route entry points that compose organisms and templates.                       | `HomePage.tsx`, `LoginPage.tsx`, `SignupPage.tsx`                            |

---

## 4. Atomic Design Hierarchy & Mandatory Component Reuse

Follow these strict rules when building or modifying UI components:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. atoms/          → Smallest indivisible UI elements        │
│    └── application/    (ApplicationTable, Pagination, Dialog)│
├─────────────────────────────────────────────────────────────┤
│ 2. molecules/      → Small combinations of atoms / loaders   │
│    └── skeleton/       (TableSkeleton)                      │
├─────────────────────────────────────────────────────────────┤
│ 3. organisms/      → Feature-complete widgets and forms      │
│    └── auth/           (LoginForm, SignupForm)              │
│    └── dashboard/      (StatsSection, OverviewCard)         │
├─────────────────────────────────────────────────────────────┤
│ 4. templates/      → Page-level layouts / structural shells │
├─────────────────────────────────────────────────────────────┤
│ 5. pages/          → Route entry points only                 │
│                        (HomePage.tsx, LoginPage.tsx)         │
└─────────────────────────────────────────────────────────────┘
```

### 🧩 Mandatory Component Reuse Rules:

1. **`atoms/application/`**:
   - Contains global application components: `ApplicationTable.tsx`, `ApplicationPagination.tsx`, and `ApplicationDialog.tsx`.
   - **Never create custom tables or modals from scratch.** When presenting data or dialogs, you **MUST** consume `ApplicationTable`, `ApplicationPagination`, and `ApplicationDialog`.
   - Always export newly created atoms through [`atoms/application/index.ts`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/apps/web/src/components/atoms/application/index.ts).
2. **`molecules/skeleton/`**:
   - Contains skeleton loaders like `TableSkeleton.tsx`.
   - **Every new organism or page section that fetches data MUST have a skeleton.** Create `<ComponentName>Skeleton.tsx` alongside the component and export from `skeleton/index.ts`.
   - Export through [`molecules/skeleton/index.ts`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/apps/web/src/components/molecules/skeleton/index.ts).
3. **`organisms/`**:
   - Group components by domain (e.g. `organisms/auth/`, `organisms/marketplace/`, `organisms/farm/`).
4. **`pages/`**:
   - Pages must remain **lightweight entry points**. They load route parameters, compose organisms/templates, and contain minimal inline JSX.
5. **No Deep Nesting**: Do not create arbitrary subdirectories inside atom or molecule folders. Keep them flat or grouped strictly under their designated domain.

### 📱 Mobile Responsive Design (MANDATORY):

> Every component, page, and organism MUST be fully mobile responsive.

1. **Mobile-First Approach**: Write default (no prefix) styles for mobile, then override for larger screens with `sm:`, `md:`, `lg:`, `xl:`.
2. **Layout Rules**:
   - Use CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) and Flexbox (`flex-col sm:flex-row`) for adaptive layouts.
   - Never use fixed `width: 1200px` or similar absolute widths for full-width containers.
3. **Table Wrapping**: Always wrap `ApplicationTable` in a horizontal scroll container on mobile:
   ```tsx
   <div className="w-full overflow-x-auto">
     <ApplicationTable ... />
   </div>
   ```
4. **Typography & Spacing**: Scale font sizes and padding using responsive classes (`text-sm sm:text-base`, `p-4 sm:p-6 lg:p-8`).
5. **Target Breakpoints**:
   - `375px` (Mobile)
   - `768px` (Tablet)
   - `1280px` (Desktop)

### 💀 Skeleton Loader Rules (MANDATORY FOR DATA-FETCHING COMPONENTS):

1. **One skeleton per data-fetching component**: If an organism, molecule, or page section loads async data, it must have an accompanying `<Name>Skeleton.tsx` file.
2. **Naming convention**: `ProductCard.tsx` → `ProductCardSkeleton.tsx`.
3. **Location**: Always place skeletons in `src/components/molecules/skeleton/` and export from `skeleton/index.ts`.
4. **Implementation**: Use `<Skeleton />` from `@workspace/ui/components/skeleton` for the shimmer effect.
5. **Usage**: Show the skeleton when `isLoading === true` and swap to the real component when data is ready:
   ```tsx
   {
     isLoading ? <ProductCardSkeleton /> : <ProductCard data={data} />
   }
   ```

---

## 5. Theme System & Styling (Colors, Buttons & View Transitions)

All design tokens, brand palettes, dark/light themes, and button styles are centralized in:
👉 [`packages/ui/src/styles/globals.css`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/packages/ui/src/styles/globals.css)

### 🎨 Changing Brand Colors

Open `packages/ui/src/styles/globals.css` and modify the annotated CSS variables:

```css
/* ==========================================================================
   1. ROOT VARIABLES (LIGHT MODE)
   ========================================================================== */
:root {
  /* Brand Green Palette */
  --primary: oklch(0.57 0.16 130); /* Primary brand green */
  --primary-foreground: oklch(0.99 0 0); /* Text on primary */

  /* Background & Surface */
  --background: oklch(0.99 0 0); /* Base background */
  --card: oklch(1 0 0); /* Card background */
  --border: oklch(0.92 0.005 130); /* Element borders */

  /* Admin Dashboard Stat Badges */
  --admin-badge-green-bg: #e8f5e9;
  --admin-badge-green-text: #2e7d32;
  --admin-badge-green-border: #c8e6c9;
}

/* ==========================================================================
   2. DARK MODE OVERRIDES
   ========================================================================== */
.dark {
  --primary: oklch(0.62 0.16 130);
  --background: oklch(0.14 0.01 130);
  --card: oklch(0.18 0.015 130);
  --border: oklch(0.26 0.02 130);
}
```

### 🔘 Universal Button Hierarchy

Buttons in SmartGrow use standardized utility classes with inline comments in `globals.css`:

| Class            | Appearance                                         | Purpose                                         |
| :--------------- | :------------------------------------------------- | :---------------------------------------------- |
| `.btn-primary`   | **Brand Green (`#7EA817` Light / `#7C9A3D` Dark)** | Primary CTAs, submit buttons, positive actions  |
| `.btn-secondary` | Muted subtle background                            | Secondary actions, alternative actions          |
| `.btn-outline`   | Bordered with hover accent                         | Filter triggers, search options, table actions  |
| `.btn-ghost`     | Transparent background                             | Cancel buttons, modal close, table icon buttons |

**Example Usage**:

```tsx
// Primary CTA (Brand Green)
<button className="btn-primary px-4 py-2">
  <Plus size={16} />
  <span>Add Record</span>
</button>

// Cancel button
<button onClick={onCancel} className="btn-ghost px-4 py-2">
  Cancel
</button>
```

### 🌓 View Transitions Theme Switching

Theme transitions are powered by the native `document.startViewTransition` API with a directional slide reveal:

```tsx
import { useTheme } from "@/hooks/useTheme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme ({theme})
    </button>
  )
}
```

---

## 6. Adding & Using ShadCN UI Components

All reusable UI primitives are maintained in the `@workspace/ui` package.

### Adding a New Primitive

To install any component from [ShadCN UI](https://ui.shadcn.com/docs/components), run the command inside the `packages/ui` directory:

```bash
cd packages/ui
npx shadcn@latest add <component-name> -y
```

_Example: `npx shadcn@latest add popover -y`_

### Consuming the Component in `apps/web`

Import the component in your application code using the `@workspace/ui` workspace alias:

```tsx
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Badge } from "@workspace/ui/components/badge"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp"
```

---

## 7. API Layer & State Management (Axios + TanStack Query)

### 🌐 Axios Client (`apps/web/src/utils/axios.ts`)

The Axios client provides:

- Base URL from `import.meta.env.VITE_API_BASE_URL` (defaults to `/api/v1`).
- `withCredentials: true` enabled for HTTP-only cookie authentication.
- **Automatic 401 Interceptor**: Catches expired tokens, queues concurrent requests, calls `/accounts/token/refresh/`, updates `localStorage`, and replays queued requests transparently.

**Example Service (`src/services/product.api.ts`)**:

```typescript
import axiosInstance from "@/utils/axios"
import type { Product } from "@/interface/product.interface"

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/products/")
  return response.data
}

export const createProduct = async (
  data: Partial<Product>
): Promise<Product> => {
  const response = await axiosInstance.post("/products/", data)
  return response.data
}
```

### ⚡ TanStack Query (`@tanstack/react-query`)

Global `QueryClientProvider` is initialized in [`apps/web/src/App.tsx`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/apps/web/src/App.tsx).

**Query Hook Example**:

```tsx
import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/services/product.api"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 60 * 1000, // Cache for 1 minute
  })
}
```

**Mutation Hook Example**:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/services/product.api"

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
```

---

## 8. Pre-Commit Pipeline (Husky & Lint-Staged)

SmartGrow enforces zero-defect code quality before every git commit via [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged).

### What Runs on `git commit`:

When you trigger `git commit`, the hook in [`.husky/pre-commit`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/.husky/pre-commit) executes this 4-step pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. npm i              → Validates dependencies              │
├─────────────────────────────────────────────────────────────┤
│ 2. npx lint-staged    → Formats staged files with Prettier   │
├─────────────────────────────────────────────────────────────┤
│ 3. npm run typecheck  → Runs full workspace TypeScript check│
├─────────────────────────────────────────────────────────────┤
│ 4. npm run build      → Ensures production bundle compiles   │
└─────────────────────────────────────────────────────────────┘
```

If any step fails, the commit is safely aborted.

### Manually Verifying Before Commit:

```bash
npm run format:check
npm run typecheck
npm run build
```

---

## 9. AI Agent Skills & Antigravity IDE

SmartGrow includes customized agent skills in `.agents/skills/` to empower developers when pair-programming with AI agents.

### Pre-Installed Skills:

- **`shadcn`**: Guides adding, customizing, and composing ShadCN UI components and presets.
- **`frontend-design`**: Aesthetics, typography, layout guidance, and UI polish rules.
- **`react-vite-best-practices`**: React performance, code-splitting, lazy loading, and Vite optimization rules.
- **`find-skills`**: Finds and installs additional specialized domain skills.

### Creating a New Skill:

To create a reusable workflow skill for your team:

1. Create a directory: `.agents/skills/<skill-name>/`
2. Add a `SKILL.md` file:
   ```markdown
   ---
   name: my-workflow
   description: Brief description of what this skill does
   ---

   # Instructions

   ...
   ```
3. Commit it to version control so all engineers and AI assistants can immediately use it.

---

## 🚀 Quick Reference Summary

| Task                     | Command / Location                                                                                                                 |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Start Dev Server**     | `npm run dev`                                                                                                                      |
| **Typecheck Workspace**  | `npm run typecheck`                                                                                                                |
| **Build for Production** | `npm run build`                                                                                                                    |
| **Format Code**          | `npm run format`                                                                                                                   |
| **Theme & Global CSS**   | [`packages/ui/src/styles/globals.css`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/packages/ui/src/styles/globals.css) |
| **Add ShadCN Component** | `cd packages/ui && npx shadcn@latest add <name> -y`                                                                                |
| **Axios Instance**       | [`apps/web/src/utils/axios.ts`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/apps/web/src/utils/axios.ts)               |
| **App Routing Root**     | [`apps/web/src/App.tsx`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/apps/web/src/App.tsx)                             |
| **Pre-Commit Hook**      | [`.husky/pre-commit`](file:///c:/Users/tejas/Documents/cronlabs/smartgrow-new/.husky/pre-commit)                                   |
| **Turborepo Video**      | [https://youtu.be/780Fyv-SAUk](https://youtu.be/780Fyv-SAUk)                                                                       |

Happy coding! 🎉
