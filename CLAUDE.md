# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site for Tourbine (https://tourbine.efenow.xyz/), a free, self-hosted 360° virtual tour app. The app itself lives in a separate repo, `efenow/tourbine`. This repo is a static one-page site: `index.html`, `styles.css`, `app.js`, plus `assets/`. There is no build step, package manager, linter or test suite.

## Running it

Serve the folder over HTTP. Opening `index.html` as a file breaks the 360° viewer, which needs to load the panorama image over HTTP.

```bash
python3 -m http.server 8000
```

Third-party code loads from CDNs at pinned versions: Pannellum 2.5.6 (jsDelivr), Font Awesome 6.5.2 (cdnjs) and Inter (Google Fonts). If those hosts are blocked, the page still renders: the hero falls back to the static `cafeteria-preview.jpg` poster, and the stop chips and viewer controls stay hidden.

## How the page fits together

- **Hero:** a live Pannellum viewer over `assets/pano/cafeteria.jpg`. The `STOPS` array in `app.js` holds each hotspot's pitch and yaw (picked from that image) and drives both the in-panorama hotspots and the "jump to a stop" chips. `setRotating()` is the single switch for auto-rotate. It also toggles `.is-rotating` on `.hero`, which is what lets the hotspot pulse animation run, so the pause button stops all motion.
- **`app.js`:** one IIFE with independent blocks: hero panorama, install tabs (with OS detection), copy buttons, nav (active section, mobile menu), the comparison deck, and the scroll reveal. Every block checks `prefers-reduced-motion`.
- **`styles.css`:** color tokens live in `:root`, and `DESIGN.md` gives the reason for each one. Breakpoints are 1100, 980, 820 (phone layout: mobile menu, stacked hero, swipeable comparison deck) and 360 px. `.band` paints a full-width tinted background with a `box-shadow`/`clip-path` trick, so sections keep their `.container` width.
- **Comparison table (`#compare`):** a semantic table with explicit ARIA roles, because below 820 px it is restyled into a horizontal scroll-snap deck. The `tbody` has `position: relative` so the absolutely positioned `.sr-only` labels stay inside the scroll strip. Without it the page scrolls sideways on phones.
- **Embed previews (`#embed`):** mock browser windows with a simplified skeleton of the real tour page from `efenow/tourbine` `views/tour.ejs`. The embed preview shows only the toolbar and room strip; the full page also has the back button and the "Powered by Tourbine" pill. `assets/pano/embed-site.jpg` and `embed-share.jpg` are perspective views rendered from `cafeteria.jpg`. The script that made them is not in the repo.

## Rules for content

- `DESIGN.md` is the design direction: palette, type, dials, and the owner's overrides of antislop findings. Follow it, and update it when a design decision changes. Antislop audits and fix reports live in `anti-slop/`.
- Write for the people who make and share tours, not developers. Use plain words; keep commands, paths and developer terms inside the install steps and the "install manually" details. Don't name the target audience on the page.
- Every product claim must match the `efenow/tourbine` source code (for example the sign-in limit, media types and embed behaviour). Competitor facts in `#compare` come only from each vendor's own website (checked November 2026). Leave anything unverified out, or mark it "Not stated".
- The FAQ appears twice: as visible `<details>` items and in the `FAQPage` JSON-LD at the bottom of `index.html`. Keep the two identical.
- No em dashes in site copy.

## Git

- Commits use the owner as author and Claude as committer. Set this up in each new session:

  ```bash
  git config author.name "efenow"
  git config author.email "73737207+efenow@users.noreply.github.com"
  git config committer.name "Claude"
  git config committer.email "noreply@anthropic.com"
  ```

- End every commit message with a `Co-Authored-By: Claude` line.
- Push only to `main`, and only when the owner says to.
