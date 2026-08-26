# 🤖 SmartGrow Strict AI Agent & Developer Rules

> [!CAUTION]
> **MANDATORY COMPLIANCE FOR ALL AI AGENTS & DEVELOPERS**  
> Every AI agent (Antigravity, Cursor, Copilot, Claude, GPT, etc.) and developer working on this codebase **MUST STRICTLY ADHERE** to the rules below. Failure to follow these rules is considered an invalid contribution.

---

## 1. 🔍 BEFORE CREATING ANY CODE: Codebase Inspection & Doc Review

Before writing, modifying, or refactoring ANY code:

1. **Search Before You Build (No Duplicate Code)**:
   - You **MUST FIRST SEARCH AND INSPECT THE CODEBASE** (using grep search, file search, or directory listing) to see if a matching component, utility function, hook, service, or pattern already exists.
   - If an existing helper, hook, or component exists, you **MUST REUSE IT** or extend it. Creating duplicate functions or parallel implementations is **STRICTLY FORBIDDEN**.
2. **Read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)**: Understand the monorepo architecture, directory mapping, API layer (Axios 401 token refresh queue + TanStack Query), and component placement rules.
3. **Read [`docs/design-guide.md`](docs/design-guide.md)**: Understand design tokens, brand green palette (`#7EA817` Light, `#7C9A3D` Dark), universal button hierarchy (`.btn-primary`), and `Application*` component guidelines.
4. **Follow Strict Directory Mapping**:
   - `src/config/` → Runtime constants & settings.
   - `src/context/` → React Context state objects.
   - `src/hooks/` → Reusable custom React hooks (`useTheme`, `useAuth`, etc.).
   - `src/interface/` → Complex API shapes & component interfaces.
   - `src/middleware/` → Auth guards & route protection (`AuthGuard.tsx`).
   - `src/providers/` → Context Provider components (`ThemeProvider.tsx`).
   - `src/services/` → Axios API endpoints (`user.api.ts`, `product.api.ts`).
   - `src/types/` → Global TypeScript types, unions, DTOs.
   - `src/utils/` → Helper functions (`axios.ts`, `localstorage.ts`, formatters).
   - `src/components/atoms/` → Base UI atoms & `atoms/application/`.
   - `src/components/molecules/` → Small functional molecules & `molecules/skeleton/`.
   - `src/components/organisms/` → Feature blocks & forms (`organisms/auth/`).
   - `src/components/templates/` → Structural layout shells (`DashboardTemplate.tsx`).
   - `src/components/pages/` → Minimal route entry points only (`HomePage.tsx`, `LoginPage.tsx`).
5. **No Deep Nesting**: Do NOT create arbitrary subdirectories inside atom, molecule, or organism folders unless explicitly grouped under a designated domain.

---

## 2. 🧩 MANDATORY COMPONENT REUSE (NO DUPLICATION)

> [!IMPORTANT]
> **NEVER RE-INVENT EXISTING COMPONENTS**  
> If a component or pattern already exists in the codebase, you **MUST REUSE IT**. Writing custom duplicates for tables, pagination, modals, dialogs, or buttons is **STRICTLY FORBIDDEN**.

1. **`Application*` Core Suite**:
   - **Data Tables**: MUST use `ApplicationTable` from `@/components/atoms/application`. Never write custom `<table>` wrappers or ad-hoc table loops.
   - **Pagination**: MUST use `ApplicationPagination` from `@/components/atoms/application`. Never create custom pagination controls.
   - **Dialogs & Modals**: MUST use `ApplicationDialog` from `@/components/atoms/application`.
   - **Table Loading**: MUST use `TableSkeleton` from `@/components/molecules/skeleton`.
2. **ShadCN Primitives**:
   - MUST reuse existing primitives in `packages/ui/src/components/` (`Button`, `Input`, `Dialog`, `Badge`, `Checkbox`, `Select`, `InputOTP`, `Separator`, etc.).
   - If a new primitive is required, add it via `cd packages/ui && npx shadcn@latest add <name> -y` and import via `@workspace/ui/components/<name>`.

---

## 3. 💀 SKELETON LOADING (MANDATORY FOR EVERY NEW COMPONENT)

> [!IMPORTANT]
> **Every new data-fetching component MUST have a corresponding skeleton.**  
> When you create a new organism, molecule, or page section that fetches data, you **MUST** also create its skeleton loader inside `src/components/molecules/skeleton/`.

**Rules**:

- Name the skeleton after the component: `ProductCard.tsx` → `ProductCardSkeleton.tsx`.
- Export it from `src/components/molecules/skeleton/index.ts`.
- Use `@workspace/ui/components/skeleton` (`<Skeleton />`) for the shimmer effect.
- Show the skeleton while `isLoading === true` and swap to real content when data arrives.

**Example**:

```tsx
// molecules/skeleton/ProductCardSkeleton.tsx
import { Skeleton } from "@workspace/ui/components/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  )
}
```

---

## 4. 📱 MOBILE RESPONSIVE DESIGN (MANDATORY)

> [!IMPORTANT]
> **Every component, page, and organism MUST be fully mobile responsive.**  
> SmartGrow targets both mobile and desktop users. All UI must adapt correctly across breakpoints.

**Rules**:

- Use Tailwind breakpoint prefixes: `sm:`, `md:`, `lg:`, `xl:` (mobile-first).
- Default (no prefix) styles apply to mobile — desktop overrides use `sm:` and above.
- Use CSS Grid and Flexbox for responsive layouts. Never use fixed pixel widths for full-width containers.
- Test on at least `375px` (mobile), `768px` (tablet), and `1280px` (desktop) viewport widths.
- Avoid `overflow-hidden` without a responsive workaround for content that needs to scroll on mobile.
- Tables: always wrap `ApplicationTable` in a horizontally scrollable container on mobile.

**Responsive Pattern Examples**:

```tsx
// ✅ Correct — mobile first, grid adapts
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// ✅ Correct — stacked on mobile, side-by-side on tablet+
<div className="flex flex-col sm:flex-row items-start gap-4">

// ✅ Correct — table wrapped for mobile scroll
<div className="w-full overflow-x-auto">
  <ApplicationTable ... />
</div>

// ❌ Wrong — fixed width breaks on small screens
<div style={{ width: "1200px" }}>
```

---

## 5. 🎨 STYLING & BUTTON RULES

1. **Centralized CSS**: All colors, background tokens, and button styles MUST come from [`packages/ui/src/styles/globals.css`](packages/ui/src/styles/globals.css). Do not use arbitrary hardcoded hex codes.
2. **Buttons**:
   - Primary Action / Submit → `.btn-primary` (Brand Green `#7EA817` Light / `#7C9A3D` Dark).
   - Secondary Action → `.btn-secondary`.
   - Filter / Bordered → `.btn-outline`.
   - Cancel / Icon → `.btn-ghost`.
3. **Clean Imports**: Use standard extensionless imports (e.g., `import { useTheme } from "@/hooks/useTheme"`).

---

## 6. 🚨 AFTER CODING: Mandatory Verification Pipeline

Before finishing any task or committing changes, you **MUST** run the full validation suite:

```bash
# 1. Check TypeScript types across all workspaces
npm run typecheck

# 2. Verify production bundle build and code-splitting
npm run build
```

### ✅ Acceptance Criteria:

- `npm run typecheck` **MUST EXIT WITH 0 ERRORS**.
- `npm run build` **MUST EXIT WITH 0 ERRORS**.
- Zero TypeScript warnings or missing type declarations.
- Zero broken imports or missing exports.

---

## 7. 🪝 PRE-COMMIT PIPELINE (Husky)

The repository has an enforced Husky pre-commit hook in `.husky/pre-commit` that automatically executes:

```sh
npm i
npx lint-staged
npm run typecheck
npm run build
```

Never bypass the hook with `--no-verify`. All errors must be resolved in code.
