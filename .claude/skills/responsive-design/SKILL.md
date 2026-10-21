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
- **Bug to avoid:** `globals.css` mixes `max-width: 768px` and `min-width: 768px`; at exactly
  768px both match. Use `max-width: 767.98px` when a max query is unavoidable, or rewrite it
  mobile-first.
- `DesktopIcon.tsx` also branches on `window.innerWidth < 768` in JS. Keep JS and CSS
  thresholds identical. Prefer `window.matchMedia('(min-width: 768px)')` and, better still,
  `(hover: hover) and (pointer: fine)` to decide double-click vs tap, since that is really a
  question about input type, not width.

## Phone layout (< 768px): recommended behaviour

- The window becomes a **full-screen sheet** (`inset: 0`, or below the menu bar). Disable drag
  and resize; hide the resize handles. Traffic-light "close" returns to the desktop grid.
- Desktop icons are a grid of tap targets (≥ 44×44px), opened with a **single tap**.
- The dock stays at the bottom: respect `env(safe-area-inset-bottom)`, keep icons ≥ 44px, and
  scroll horizontally if there are more than 5–6 items rather than shrinking them.
- Hover-only tooltips do not exist on touch, so labels must be visible or implied.

## Sizing rules

- Use `dvh`/`svh` instead of `vh` for full-height elements. On iOS Safari `100vh` is taller
  than the visible area and hides the dock and the bottom of windows.
  `DraggableWindow.tsx` sets heights in `vh` (`70vh`, etc.); give it a `dvh` value or cap it with
  `min(70dvh, calc(100dvh - <menubar> - <dock>))`.
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

Use Chrome DevTools device mode, and test once on a real phone over the LAN
(`npm run dev -- -H 0.0.0.0`, then open `http://<your-mac-ip>:3000`). Look for: horizontal
scroll, content hidden behind the dock or menu bar, unreachable buttons, text below 16px in
inputs (iOS zooms in on focus), and windows that cannot be closed.
