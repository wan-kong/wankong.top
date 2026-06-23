# AGENTS.md

This file provides guidance when working with code in this repository.

> The line above imports the project-wide rule: **this Next.js (16.2) has breaking changes vs. your training data.** Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code.

## Commands

Package manager is **Bun** (`bun.lock`, CI uses `bun install --frozen-lockfile`). Note that some `package.json` scripts still shell out to `pnpm`/`portless`.

- `bun run dev` — dev server (`portless wankong next dev`, serves under the `wankong` portless host)
- `bun run build` — static export to `out/` (the site is `output: "export"`, fully prerendered)
- `bun run lint` — Biome check (lint). `bun run format` — Biome format-write
- `bun run deploy` — `build` then `sync:out` (scp `out/` to the remote host using `.env` creds)
- `bun run images:webp [paths...] [--quality N] [--overwrite]` — convert raster images under `public/imgs` to WebP via sharp

There is **no test suite**. Quality gate is Biome only (tab indent, `useSortedClasses` auto-fix on `clsx`/`cva`/`cn`, organize-imports). Type errors surface via `bun run build`.

## Architecture

A statically-exported personal site (Next.js 16 App Router, React 19, React Compiler on, Tailwind v4). All routes prerender at build time — there is no server runtime in production; `out/` is synced to a plain host.

### Content is data, not pages

Two content sources drive the site; adding content means editing these, not adding routes:

- **Blog posts** — `.mdx` files in `src/posts/`. Frontmatter (`title`, `date`, `tags`, `description`, `hidden`, `lang`, `duration`, `updated`) is parsed by `src/lib/blog.ts`, the single data layer. `getAllBlogPosts()` (React `cache`d) reads the dir, filters `hidden`, sorts by date desc. `tags` accepts a comma-string or array. `hidden: true` drops a post everywhere.
- **Products** — a typed array in `src/lib/products.ts` (`satisfies Product[]`). Each entry carries its own icon component (Simple Icons / Lobehub / Remix). A product may link to a post via `postSlug`.

`/blog/[slug]` uses `generateStaticParams` + `dynamicParams = false`, so only known slugs build.

### MDX is rendered two different ways

1. **Imported `.md`/`.mdx` as pages/components** — via `@next/mdx` configured in `next.config.ts` (remark-gfm + `@shikijs/rehype`). `pageExtensions` includes `md`/`mdx`.
2. **Post bodies rendered at build time** — `src/app/(main)/blog/[slug]/page.tsx` calls `@mdx-js/mdx`'s `evaluate()` on the raw post content with remark-gfm, `remarkHeadingIds`, and rehype-shiki.

Both paths share Shiki config from `src/lib/mdx-shiki.ts` (github-light/dark, `light-dark()`). Custom element mappings (`a`, `img`→ImageZoom, `pre`→CodeBlock) plus MDX-callable components (`ScriptInstall`, `GithubCard`) live in `src/mdx-components.tsx`. The TOC is parsed separately from raw markdown by `src/lib/mdx-toc.ts` — `getTableOfContents` (regex over headings, skips code fences) must stay slug-compatible with `remarkHeadingIds` (shared slugger logic).

### Layout & styling

- `src/app/layout.tsx` — root: 4 Google fonts mapped to CSS vars (`--font-mono` JetBrains Mono is the **default body font**, `--font-ui`, `--font-display`, `--font-data`), ThemeProvider, Baidu analytics.
- `src/app/(main)/layout.tsx` — route group with NavHeader, footer (ICP record), NoiseTexture overlay, BackTop.
- Tailwind v4 lives entirely in `src/app/globals.css` (no JS config); theme tokens are OKLCH CSS vars registered via `@theme inline`. shadcn config: `base-lyra` style, neutral, Phosphor icons, registries for magicui/animate-ui/aceternity. Path alias `@/*` → `src/*`.
- The design language (brutalist, `rounded-none` everywhere, heavy borders, single neutral hue, animation specs) is documented in `docs/DESIGN-STYLE.md` — consult it before adding UI so new components match.

### Deploy

Push to `main` triggers `.github/workflows/` (Bun → `next build` → scp `out/` to the remote, wiping the target dir except `.user.ini`). A separate release workflow zips `out/` as a `dist.zip` asset. Local `bun run deploy` does the same sync via `scripts/sync-out.sh` using `.env` (`OUT_SYNC_*`).
