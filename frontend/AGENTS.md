# Project Instructions

These instructions apply to the entire repository.

## Technology

- Use React, TypeScript, and Vite.
- Use Tailwind CSS for styling.
- Use shadcn/ui for reusable UI primitives.
- Use `lucide-react` for interface icons.
- Use the `@/*` path alias for imports from `src`.

## Atomic Design

Place every new UI component in the smallest appropriate layer:

```text
src/
|-- components/
|   |-- atoms/
|   |   `-- ui/          # shadcn/ui primitives
|   |-- molecules/
|   |-- organisms/
|   `-- templates/
|-- pages/
|-- hooks/
`-- lib/
```

- `atoms`: indivisible UI elements such as badges, labels, and shadcn primitives.
- `molecules`: small combinations of atoms with one focused responsibility.
- `organisms`: complete interface sections composed from atoms and molecules.
- `templates`: page layout and composition without route-specific data or business logic.
- `pages`: route-level composition that supplies page-specific content and behavior.

Dependencies must flow downward:

```text
pages -> templates -> organisms -> molecules -> atoms
```

A layer may import from lower layers, but never from a higher layer. Do not put a
large page section directly in `pages` when it can be extracted into an organism.
Avoid creating components that only rename another component without adding a clear
responsibility.

## shadcn/ui

- Check for a suitable shadcn/ui component before building a UI primitive manually.
- Add components with `npx shadcn add <component>`.
- Keep generated shadcn components in `src/components/atoms/ui` as configured in
  `components.json`.
- Import them through `@/components/atoms/ui/<component>`.
- Compose shadcn primitives in molecules and organisms; do not copy their source into
  multiple feature folders.
- Customize the local shadcn source or its variants when necessary while preserving
  keyboard behavior, focus styles, disabled states, and accessibility attributes.
- Use the shared `cn` helper from `@/lib/utils` for conditional Tailwind classes.

## Icons

- Use icons from `lucide-react`. Do not use emoji, icon fonts, or handwritten inline
  SVG for interface icons when a suitable Lucide icon exists.
- Use named imports, for example `import { Search } from 'lucide-react'`, so unused
  icons can be tree-shaken.
- Mark decorative icons with `aria-hidden="true"`.
- Give icon-only controls an accessible name using visible text, an `sr-only` label,
  or an appropriate `aria-label` on the control.
- Keep icon sizing consistent with Tailwind classes such as `size-4` or `size-5`.

## Components and Pages

- Use PascalCase filenames and named exports for components and pages.
- Define explicit TypeScript props; do not use `any`.
- Prefer composition over large components and excessive configuration props.
- Keep business logic in hooks or domain modules, not in visual atoms.
- Reuse existing components before creating new ones.
- Use semantic HTML and preserve keyboard navigation and visible focus states.
- Design responsive layouts from mobile to larger breakpoints.

## Styling

- Prefer Tailwind utilities over component-specific CSS files or inline `style` props.
- Use the theme tokens defined in `src/index.css`, such as `bg-background`,
  `text-foreground`, `bg-card`, `text-muted-foreground`, and `border-border`.
- Do not hardcode colors when an existing semantic token fits.
- Extend global CSS only for application-wide tokens, resets, or behavior that cannot
  be expressed cleanly with Tailwind.
- Support the existing `.dark` theme tokens when introducing colors or states.

## Workflow

Before finishing a UI change:

1. Confirm that each component is in the correct Atomic Design layer.
2. Confirm that dependency direction is not violated.
3. Confirm that existing shadcn primitives and Lucide icons are reused.
4. Run `npm run lint`.
5. Run `npm run build`.

Do not consider the change complete while linting or the production build fails.

## Informasi Proyek: Crousel Official

Crousel Official membutuhkan website resmi yang berfungsi sebagai pusat informasi brand,
katalog produk, dan jalur pembelian digital. Website menampilkan karakter Crousel sebagai
brand sandal yang mengedepankan kualitas, desain produk, kenyamanan, dan gaya casual yang
stylish.

Materi brand menyebutkan bahwa Crousel Official berdiri sejak 2020 dan memiliki channel
penjualan/komunikasi melalui Instagram, Shopee, TikTok, Blibli, dan WhatsApp. Website menjadi
titik pusat brand yang mengarahkan pengunjung ke produk dan channel pembelian.

| Informasi Brand | Detail |
| --- | --- |
| Nama Brand | Crousel Official |
| Bidang | Fashion / Footwear / Sandal |
| Tahun Berdiri | 2020 |
| Produk Utama | Sandal casual, sandal slide, sandal slop, sandal wedges, dan kids |
| Target Produk | Wanita, pria/unisex, serta anak-anak |
| Fokus Brand | Kualitas, desain produk, kenyamanan, dan gaya stylish |
| Tagline yang tersedia | YOUR HAPPINESS STUFF |
| Brand statement | Crafted with passion & pride on every inch of sandals. |

Materi sumber menyatakan bahwa Crousel Official mengedepankan kualitas, desain produk yang
baik, serta produk yang cocok menemani aktivitas agar pengguna tampil lebih stylish. Produk
casual tertentu ditujukan untuk pria maupun wanita (UNISEX).

## Aturan Referensi Visual

Jika pengguna melampirkan referensi design atau layout dalam bentuk gambar, yang disalin hanya
struktur layout, komposisi, dan pola interaksinya. Warna tidak disalin dari gambar referensi;
gunakan warna yang tersedia pada CSS variables proyek agar tetap konsisten dengan design system.
