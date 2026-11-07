# Contributing / Development

Technical documentation for working on the PurpleFoxxx site codebase.

For the "who/what" of PurpleFoxxx itself, see [`README.md`](./README.md).

---

# Stack

- **[11ty (Eleventy)](https://www.11ty.dev/)** with Nunjucks templates — static output, no server runtime
- **[Tailwind CSS](https://tailwindcss.com/)** — utility-first styling, light/dark via `class` strategy
- **[Vercel](https://vercel.com/)** — static hosting, config in `vercel.json`

---

# Getting Started

```bash
npm install
npm run dev
```

This runs Tailwind in watch mode and the 11ty dev server in parallel.

The site is served at:

```
http://localhost:8080
```

---

# Build for Production

```bash
npm run build
```

Outputs the finished static site to:

```
_site/
```

---

# Project Structure

```text
src/
├── _data/
│   ├── site.json
│   ├── team.json
│   ├── achievements.json
│   └── work.json
│
├── _includes/
│   ├── layouts/
│   │   ├── base.njk
│   │   └── page.njk
│   │
│   └── partials/
│       ├── nav.njk
│       ├── footer.njk
│       ├── theme-toggle.njk
│       ├── rank-badge.njk
│       ├── flag-drift.njk
│       └── fox-run.njk
│
├── pages/
│   ├── index.njk
│   ├── about.njk
│   ├── team.njk
│   ├── achievements.njk
│   ├── work.njk
│   ├── contact.njk
│   ├── 404.njk
│   └── flag.njk
│
└── assets/
    ├── css/
    │   └── main.css
    │
    ├── js/
    │   └── theme.js
    │
    └── images/
        ├── logo-dark.png
        ├── logo-light.png
        └── favicon.*
```

Content—member bios, social links, achievement history, and work entries—lives entirely inside `src/_data/*.json`, so most updates don't require touching templates.

---

# Data Files

| File                | Drives                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.json`         | Site name, tagline, description, skills list, footer links                                                                                                                               |
| `team.json`         | Four member cards on `/team/` and the Home page team strip                                                                                                                               |
| `achievements.json` | Timeline on `/achievements/`. Each entry contains both `rank` (badge appearance) and `tier` (`high` / `med` / `low`) controlling timeline emphasis. These are intentionally independent. |
| `work.json`         | `/work/` content divided into `boot2root`, `labs`, and `projects`                                                                                                                        |

---

# Collections

Defined in `.eleventy.js`.

### `achievementsTimeline`

All achievements sorted from oldest to newest.

### `recentBuilds`

Returns the two most recent entries from:

- `boot2root`
- `labs`

Projects are intentionally excluded because they are ongoing/WIP rather than completed builds.

---

# Filters

Defined in `.eleventy.js`.

### `dateReadable`

Converts an ISO date into a readable month.

Example:

```
2025-08-01
↓
August 2025
```

### `rankTier`

Maps a rank string such as:

- `1st Rank`
- `Top 20`

into one of:

- `gold`
- `silver`
- `bronze`
- `outline`

This controls the appearance of the `rank-badge` partial.

> **Note**
>
> Do not confuse `rankTier` with the `tier` field in `achievements.json`.
>
> - `rank` → badge color
> - `tier` → timeline weight/card size
>
> They intentionally represent different concepts.

---

# Theming

Colors are defined as CSS variables inside:

```
src/assets/css/main.css
```

and exposed to Tailwind through:

```
tailwind.config.js
```

The palette is sampled directly from the PurpleFoxxx logo.

| Token         | Light     | Dark      |
| ------------- | --------- | --------- |
| Background    | `#FDFBFF` | `#0A0612` |
| Accent        | `#8B23D9` | `#C13FFF` |
| Accent (Deep) | `#5B12B0` | —         |
| Text Primary  | `#170D26` | `#F5F0FF` |

### Fonts

- **Space Grotesk** — headings/display
- **Inter** — body text
- **JetBrains Mono** — terminal accents, timestamps, code, metadata

### Logos

Located in:

```
src/assets/images/
```

- `logo-dark.png` — neon version used in dark mode
- `logo-light.png` — flat recolored version used in light mode

They are swapped automatically via `<picture>` in `nav.njk`.

---

# Notable Non-Obvious Behavior

### 404 Page

`src/pages/404.njk` sets:

```yaml
permalink: 404.html
```

This forces output to:

```
_site/404.html
```

instead of:

```
_site/404/index.html
```

which is required for Vercel to automatically serve the custom 404 page.

---

### `flag.njk`

This page is intentionally hidden.

- Not linked from navigation
- Not included in the sitemap

It is meant to be discovered only by guessing the URL.

Do **not** add it to navigation.

---

### `robots.txt`

The spacing and hidden message at the bottom are intentional.

They form part of a chained easter egg together with `/flag`.

Please do **not** "clean up" the file.

---

### Dark-Mode-Only Effects

Dark-mode-only components (such as:

- `flag-drift.njk`
- the achievements signal-line timeline

) watch for:

```html
<html class="dark"></html>
```

using a `MutationObserver`, keeping themselves synchronized with `theme.js`.

If adding additional dark-mode-only functionality, follow the same pattern instead of duplicating theme detection logic.

---

### `achievements.njk`

The page intentionally renders **two complete layouts**:

```html
dark:hidden
```

and

```html
hidden dark:block
```

instead of conditionally styling one shared layout.

The light and dark versions differ enough structurally that duplicated markup is significantly cleaner than trying to unify them.

---

# Writing Tone

Keep all copy:

- descriptive
- factual
- non-promotional

See `README.md` for the reasoning.

Avoid:

- "Hire us"
- marketing language
- audience-specific CTAs
- sales-oriented copy on the Work page

Achievements and project work should speak for themselves.

---

# Deployment

The site is connected to **Vercel**.

Configuration lives in:

```
vercel.json
```

Build settings:

| Setting          | Value           |
| ---------------- | --------------- |
| Build Command    | `npm run build` |
| Output Directory | `_site`         |
