---
name: responsive-design
description: Make the desktop-metaphor portfolio work on phones, tablets, laptops and ultrawide screens. Use when changing layout, window sizing, the dock, desktop icons, or breakpoints, when something overflows or is cut off on mobile, or when the user mentions mobile, tablet, touch, iPhone, or screen sizes.
---

# Responsive design

More than half of portfolio visits come from a phone, usually from a LinkedIn link. A
draggable-window desktop does not translate literally to a 375px touch screen, so mobile
needs its own deliberate layout rather than a shrunken desktop.

## Breakpoints in use

The codebase uses `768px` (tablet/desktop switch) and `1024px`. Keep to these:

```css
/* mobile-first */
.x { … }                                  /* < 768px: phone */
@media (min-width: 768px)  { .x { … } }   /* tablet and up: desktop metaphor */
@media (min-width: 1024px) { .x { … } }   /* laptop and up */
```
- **Phone layout query (implemented 2026-10-21).** Structural CSS and `src/hooks/useIsMobile.ts`
  share one query: `(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse),
  (max-height: 500px) and (pointer: coarse)` (phones, touch tablets in portrait, landscape phones).
  Change all of them together: `globals.css`, `MobileDock.module.css`, `DesktopIcon.module.css`,
  `useIsMobile.ts`. Never reintroduce `max-width: 768px` (it overlaps `min-width: 768px`).
- **Section content uses container queries, not media queries.** `.window-content-scroll` is
  `container: window / inline-size`; write `@container window (max-width: 599.98px)` for phone
  tuning and `(min-width: 600px | 800px)` for wider windows. A desktop window is only 55–75vw, so
  viewport queries mis-fire (the hero clipped at ~1024px before this).
- `DesktopIcon.tsx` opens on one tap whenever `(hover: none)` matches (phones and tablets), and on
  double-click with a mouse. It is keyboard-accessible (Enter/Space).

## Phone layout: what is built

- `DraggableWindow.tsx` renders `.mobile-window`: a fixed full-width sheet between the menu bar
  and the dock, no drag/resize, Close only (44px touch target). It scrolls to top on section
  change and when the open section is re-tapped in the dock.
- `MobileDock.tsx`: iOS-style dock, 5 sections, safe-area aware, shorter and centred in landscape.
- Closed window → the folders form a 4-column iOS-style home screen.
- `PrototypeViewer.tsx` delegates to `PrototypeMobile.tsx` on phones: the app screen fills the display
  edge to edge (scaled below 375px, capped at 430px), with top/bottom bars and bottom sheets for flows
  and PM notes. Landscape phones see a rotate prompt.
- Hover-only tooltips do not exist on touch, so labels must be visible or implied.

## Sizing rules

- Use `dvh`/`svh` instead of `vh` for full-height elements. On iOS Safari `100vh` is taller
  than the visible area and hides the dock and the bottom of windows.
  The desktop window still sizes in `vh`; the phone sheet avoids that by using fixed `top`/`bottom`.
- Window widths in `vw` need clamps so they don't become 1600px wide on ultrawide or 280px on
  small tablets: `clamp(320px, 60vw, 1100px)`.
- Fluid type for headings: `font-size: clamp(1.75rem, 1.2rem + 2vw, 2.5rem)`.
- Images: `max-width: 100%; height: auto;` and `sizes` on `next/image`.
- `html, body { overflow-x: hidden }` hides overflow bugs instead of fixing them. When something
  overflows, find the element (DevTools → "Show layout shift regions" / outline everything with
  `* { outline: 1px solid red }`) rather than relying on the clip.
- Viewport meta is injected by Next automatically. To customise it, export `viewport` from
  `layout.tsx` (see `generate-viewport.md` in the bundled docs); never add a raw `<meta>` tag.

## Test matrix

Check every changed screen at these widths, in portrait and landscape where it applies:

| Device class | Width × height |
|---|---|
| Small phone (iPhone SE) | 375 × 667 |
| Modern phone (iPhone 15) | 393 × 852 |
| Tablet portrait (iPad) | 768 × 1024 (exact breakpoint) |
| Laptop | 1280 × 800 |
| Desktop / ultrawide | 1920 × 1080, 2560 × 1080 |

A touch-emulating puppeteer sweep (isMobile + hasTouch) over every prototype screen catches clipped
fixed-height layouts. Short phones (375×667) are the hardest case: screens must scroll or let art shrink
rather than clip.

Use Chrome DevTools device mode, and test once on a real phone over the LAN
(`npm run dev -- -H 0.0.0.0`, then open `http://<your-mac-ip>:3000`). Look for: horizontal
scroll, content hidden behind the dock or menu bar, unreachable buttons, text below 16px in
inputs (iOS zooms in on focus), and windows that cannot be closed.
