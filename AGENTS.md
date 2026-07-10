# AGENTS.md

This file provides guidance when working with code in this repository.

> **This Next.js (16.2) has breaking changes vs. your training data.** Before writing any Next.js code, read the relevant guide under `node_modules/next/dist/docs/` — particularly `03-architecture/` for App Router patterns and `01-app/` for routing/rendering changes.

## Commands

Package manager is **Bun** (`bun.lock`, CI uses `bun install --frozen-lockfile`). Note: some `package.json` scripts still shell out to `pnpm` — always use `bun run` instead.

- `bun run dev` — dev server (`portless wankong next dev`, serves under the `wankong` portless host at `http://localhost:3456`)
- `bun run build` — static export to `out/` (the site is `output: "export"`, fully prerendered; fails on type errors)
- `bun run lint` — Biome check (lint + import organize). `bun run format` — Biome format-write (auto-fixes `useSortedClasses` on `clsx`/`cva`/`cn`)
- `bun run deploy` — (note: script body uses `pnpm`, prefer `bun run build && bun run sync:out`) builds then scp's `out/` to the remote host using `.env` creds (`OUT_SYNC_*`)
- `bun run images:webp [paths...] [--quality N] [--overwrite]` — convert raster images under `public/imgs` to WebP via sharp

There is **no test suite**. Quality gate is Biome only (tab indent, `useSortedClasses` auto-fix, organize-imports). Type errors surface via `bun run build`.

## Architecture

A statically-exported personal site (Next.js 16 App Router, React 19, Tailwind v4). Key constraints from `next.config.ts`:

- **`output: "export"`** — no server runtime in production; `out/` is synced to a plain host. This means: no middleware, no rewrites/redirects, no dynamic routes (except those with `generateStaticParams`), no `next/image` optimization (hence `images.unoptimized: true`).
- **`reactCompiler: true`** — React Compiler is on. Don't add `useMemo`/`useCallback`/`React.memo`; the compiler handles memoization. The `babel-plugin-react-compiler` dev dep enables lint warnings for rules-of-react violations.
- **`typedRoutes: true`** — use `Route<string>` from `next` for type-safe hrefs (see `BlogPostMeta.href` in `src/lib/blog.ts`).
- **`pageExtensions: ["ts", "tsx", "md", "mdx"]`** — `.md`/`.mdx` files in `src/app/` are treated as pages.

### Content is data, not pages

Two content sources drive the site; adding content means editing these, not adding routes:

- **Blog posts** — `.mdx` files in `src/posts/`. Frontmatter fields:
  - `title` (required), `date` (required, ISO or date string), `tags` (comma-separated string or array)
  - `description`, `hidden` (boolean), `lang`, `duration`, `updated`
  - Parsed by `src/lib/blog.ts` — `getAllBlogPosts()` is React `cache`d, filters `hidden`, sorts by date desc. `hidden: true` drops a post from all listings and sitemap.
- **Products** — a typed array in `src/lib/products.ts` (`satisfies Product[]`). Each entry carries its own icon component from one of three libraries (Simple Icons / Lobehub / Remix). A product may link to a post via `postSlug`.

`/blog/[slug]` uses `generateStaticParams` + `dynamicParams = false` — unknown slugs return 404 at build time (no fallback).

### MDX: two rendering paths (critical distinction)

1. **Imported `.md`/`.mdx` as pages/components** — via `@next/mdx` (webpack loader, configured in `next.config.ts`). Uses remark-gfm + `@shikijs/rehype`. Applies to any `.md`/`.mdx` file in the `src/app/` tree (e.g. standalone pages). Rendered by the Next.js pipeline at compile time.

2. **Post bodies rendered at build time** — `src/app/(main)/blog/[slug]/page.tsx` calls `@mdx-js/mdx`'s `evaluate()` synchronously during prerender. Uses remark-gfm, `remarkHeadingIds`, and rehype-shiki. The `evaluate()` call must pass `...runtime` from `react/jsx-runtime` and `baseUrl: import.meta.url`.

Both paths share Shiki config from `src/lib/mdx-shiki.ts` (github-light/dark themes, `light-dark()` CSS). Custom element mappings (`a`→external links, `img`→ImageZoom, `pre`→CodeBlock) plus MDX-callable components (`ScriptInstall`, `GithubCard`, `Callout`, `Steps`, `Step`, `Kbd`, `NetworkPanel`, `NetworkInspector`, `ConsoleView`, `ScrollFadeDemo`, `ShimmerDemo`) are defined in `src/mdx-components.tsx` and passed as `components` to the MDX render.

**TOC synchronization constraint**: The TOC is parsed from raw markdown by `src/lib/mdx-toc.ts` (`getTableOfContents` — regex over headings, skips code fences). The slugger logic in `getTableOfContents` and `remarkHeadingIds` must stay identical — if you modify one, update both.

### Key design constraints

Consult `docs/DESIGN-STYLE.md` for the full spec. Critical rules when adding UI:

- **`rounded-none` on everything** — no rounded corners anywhere (brutalist design). Exception: avatars `rounded-full`.
- **Borders over shadows** — `border border-border` separates elements, not box shadows. Hover states use `hover:border-foreground/35` + `hover:bg-muted/50`.
- **Single neutral hue** — entire site uses neutral OKLCH palette (no color hue). Color only appears in product status badges (emerald/amber) and product icons.
- **Font system**: `font-mono` (JetBrains Mono) is default body, `font-ui` (Space Grotesk) for headings/nav, `font-data` (Space Mono) for dates/metadata/tags.
- **Animation**: all entry animations come from CSS keyframes in `globals.css` (`blog-enter`, `blog-card-enter`, `product-title-reveal`). Staggered with `animation-delay` increments of 45–80ms. Respect `prefers-reduced-motion`.
- **Theme toggle**: uses View Transition API for animated shape morph between light/dark. The `AnimatedThemeToggler` component in `src/components/ui/animated-theme-toggler.tsx` manages this.

### Layout & styling

- `src/app/layout.tsx` — root: 4 Google fonts loaded as CSS vars, `ThemeProvider` (next-themes, `class` strategy, `light` default), Baidu analytics via `<Script>`.
- `src/app/(main)/layout.tsx` — route group: `NavHeader`, `NoiseTexture` overlay (SVG `feTurbulence`), `BackTop`, footer with ICP record.
- `src/app/globals.css` — all Tailwind v4 config (no JS config file). Theme tokens as OKLCH CSS custom properties registered via `@theme inline`. shadcn config in `components.json`: `base-lyra` style, neutral base, Phosphor icons, registries: `@magicui`, `@animate-ui`, `@aceternity`.
- `not-found.tsx`, `robots.ts`, `sitemap.ts` — static metadata/SEO routes at the app root.
- Path alias: `@/*` → `src/*`.

### Directory map (non-obvious locations)

| Path                              | Purpose                                                                                |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/blog.ts`                 | Single data layer for all blog posts                                                   |
| `src/lib/products.ts`             | Product catalog data                                                                   |
| `src/lib/mdx-toc.ts`              | TOC parser + remark slug plugin                                                        |
| `src/lib/mdx-shiki.ts`            | Shared Shiki syntax highlight config                                                   |
| `src/lib/utils.ts`                | `cn()` (clsx + tailwind-merge)                                                         |
| `src/mdx-components.tsx`          | MDX component mappings (shared by both render paths)                                   |
| `src/components/mdx/`             | Components callable from within MDX                                                    |
| `src/components/ui/`              | shadcn-based UI primitives (Button, etc.) + custom (NoiseTexture, EncryptedText, etc.) |
| `src/components/blog/`            | Blog-specific components (archive, header, card)                                       |
| `src/components/home/`            | Homepage section components                                                            |
| `src/components/products/`        | Product card/list components                                                           |
| `src/contexts/theme-provider.tsx` | Thin wrapper around next-themes for client-side theme                                  |
| `src/hooks/use-is-in-view.tsx`    | IntersectionObserver hook for scroll-triggered animations                              |
| `.claude/skills/`                 | Claude Code custom slash commands                                                      |
| `.claude/settings.local.json`     | Local permissions (git, web fetch domains, etc.)                                       |
| `skills-lock.json`                | Lockfile for installed Claude Code skills                                              |

### Deploy

Push to `main` triggers `.github/workflows/deploy.yml` (Bun install → `next build` → scp `out/` to remote, wiping target dir except `.user.ini`). `.github/workflows/release-dist.yml` creates a `dist.zip` release asset. Local deploys use `scripts/sync-out.sh` with `.env` vars (`OUT_SYNC_*`).
