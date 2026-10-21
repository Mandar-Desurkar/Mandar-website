---
name: accessibility-audit
description: Audit and fix accessibility (WCAG 2.2 AA) in this portfolio. Use when building or reviewing any interactive UI (desktop icons, dock, draggable window, popups, buttons, links, forms), animations, colours/contrast, images, or when the user mentions a11y, keyboard navigation, screen readers, focus, or reduced motion.
---

# Accessibility audit (WCAG 2.2 AA)

A desktop-OS metaphor is fun but easy to make inaccessible: clickable `div`s, double-click-only
actions, a custom cursor, and motion everywhere. Hiring managers and recruiters include keyboard
and screen-reader users, and a portfolio that fails basic a11y signals poor craft.

## Project-specific issues to check first

| Where | Problem | Fix |
|---|---|---|
| `DesktopIcon.tsx` | `div` with `onClick`/`onDoubleClick`; desktop needs a **double-click**; not focusable | Render a `<button type="button">`; open on Enter/Space; single click selects, double click or Enter opens |
| `Dock.tsx` | Each `dockItem` is a clickable `div`; tooltip shown only on hover | `<button aria-label="Experience">`, show the tooltip on `:focus-visible` too, `aria-current="page"` on the active item |
| `DraggableWindow.tsx` | The window is not announced; focus is not moved into it when a tab opens | `role="dialog"` or `role="region"` + `aria-labelledby` the title; move focus to the heading when `activeTab` changes; Esc closes |
| `TrafficLights.tsx` | Coloured dots with no labels | `aria-label="Close window"` / `"Minimise"` / `"Maximise"` on real buttons |
| Dock popups (`.popup-overlay`) | No dialog semantics or focus trap | `role="alertdialog"`, `aria-modal`, focus the OK button, Esc closes, return focus to the trigger on close |
| `globals.css` `*` custom cursor | Overrides `pointer`/`text` cursors everywhere | Scope it to `body`; keep `cursor: pointer` on interactive elements |
| `globals.css` `user-select: none` on body + `NoInspect.tsx` copy blocking | Prevents copying the email and phone number, and breaks assistive tools that rely on selection | Allow selection inside window content; never block copy on contact details |
| framer-motion animations | No reduced-motion handling | Wrap the app in `<MotionConfig reducedMotion="user">`; in CSS add `@media (prefers-reduced-motion: reduce)` to disable transitions |
| `BootScreen` | 1.25s blocking animation | Skip it under reduced motion; give it `aria-hidden` or `role="status"` text |

## General checklist

- **Semantics**: interactive = `<button>` or `<a href>`. One `<h1>`, then ordered `<h2>`/`<h3>`.
  Landmarks: `<header>`/`<nav>` (menu bar), `<main>`, `<footer>`.
- **Keyboard**: everything reachable with Tab in a logical order, operable with Enter/Space,
  dismissible with Esc. No keyboard traps.
- **Focus visible**: never `outline: none` without a replacement. Use
  `:focus-visible { outline: 2px solid var(--ink-blue); outline-offset: 2px; }`.
- **Contrast**: body text ≥ 4.5:1, large text and UI parts ≥ 3:1. Check text over the wallpaper
  and over translucent `--os-titlebar` / `--os-window` backgrounds; these are the usual failures.
- **Images**: informative images get specific `alt`; decorative ones (folder art when a label
  sits next to it) get `alt=""`.
- **Icon-only links** (GitHub, external-link, LinkedIn): `aria-label`, and
  `rel="noopener noreferrer"` with `target="_blank"`, plus visually hidden "(opens in new tab)" text.
- **Target size**: ≥ 24×24 CSS px (WCAG 2.2 SC 2.5.8). Traffic-light dots are often too small.
  Enlarge the hit area with padding.
- **Placeholder links**: `href="#"` is a broken link for screen readers. Remove it or point it at
  something real.
- **Language**: `<html lang="en">` is already set. Keep it.

## How to run the audit

1. Static scan for the common smells:
   ```bash
   grep -rn "onClick" src/components | grep -v "<button\|<a " | head -30   # clickable non-buttons
   grep -rn 'href="#"' src/                                              # placeholder links
   grep -rn "outline: *none\|outline: *0" src/                           # removed focus rings
   grep -rn "<img\|<Image" src/ | grep -v "alt="                         # missing alt
   ```
2. Automated: with `npm run dev` running,
   `npx --yes @axe-core/cli http://localhost:3000 --exit` (also try with `--tags wcag22aa`).
   Lighthouse's accessibility category (see `performance-audit`) is a second opinion.
3. Manual, because automated tools catch only ~30–40% of issues: unplug the mouse and open every
   section, dock item, popup and link with the keyboard only. Then try VoiceOver (Cmd+F5 on macOS):
   is every control announced with a sensible name and role?

Report findings as: element, file:line, WCAG criterion, fix. Fix the highest-impact issues
(keyboard access to icons and dock) first.
