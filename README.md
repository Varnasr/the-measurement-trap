# The Measurement Trap — Companion Website

Companion page for **_The Measurement Trap: India's Quest for Social Progress Through Eight Decades_** by [Varna Sri Raman](https://github.com/Varnasr) (Routledge, forthcoming).

The book tells the history of independent India through the machinery it built to count itself — the census, the sample surveys, the national accounts, and the people who designed them, ran them, defended them and, in recent years, fought over them. This site is a companion for readers, students, journalists and policy audiences: it offers orientation and a sourced chronology. It does **not** reproduce the manuscript.

**Live site:** https://varnasr.github.io/the-measurement-trap/ · *(update once the deploy target is confirmed)*

---

## What's here

| File | Purpose |
|------|---------|
| `index.html` | The companion page — a single, self-contained static page (abstract, argument, plan of the book, method, chronology, publication details). |
| `favicon.svg` | Site icon (a ruler-scale motif). |
| `netlify.toml` | Optional Netlify config: publish root + security headers. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (no Jekyll processing). |
| `robots.txt` | Allows indexing; points crawlers at the site. |
| `LICENSE` | MIT — covers the **site code** only (see *Rights* below). |

The page is vanilla HTML and CSS with **no build step and no JavaScript**. The only external resource is the STIX Two Text webfont from Google Fonts.

## Features

- Typeset in the style of an academic working paper (STIX Two Text, booktabs-style rules).
- Automatic **light/dark mode** (`prefers-color-scheme`).
- **Print stylesheet** — prints cleanly to a black-on-white document.
- Open Graph / Twitter Card metadata, canonical URL, SVG favicon, theme-colour.
- Accessible: skip-to-content link, `aria` labels on the schematic and tables, visible focus states, respects `prefers-reduced-motion`.
- Responsive down to narrow phones; wide tables scroll horizontally rather than breaking the layout.

## Local preview

No tooling required — open the file, or serve the folder:

```bash
git clone https://github.com/Varnasr/the-measurement-trap.git
cd the-measurement-trap
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Deploying

**GitHub Pages** — Settings → Pages → Deploy from branch → `main` / root. The site is served from the repository root; `.nojekyll` is already included.

**Netlify** — point Netlify at this repo; `netlify.toml` sets the publish directory to root and adds baseline security headers. No build command needed.

After deploying, update the canonical / Open Graph URLs in `index.html` (and the live-site link above) if the final domain differs from the GitHub Pages default.

## Rights

The `LICENSE` (MIT) applies to the **website code** — the HTML, CSS and favicon. The **text of the book and its companion content** (abstract, chapter summaries, chronology) is © Varna Sri Raman and is **not** placed under the MIT licence; all rights are reserved. Publication date, ISBN and ordering links will be added when Routledge confirms them.
