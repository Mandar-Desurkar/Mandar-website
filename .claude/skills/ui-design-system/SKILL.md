---
name: ui-design-system
description: Visual design rules for this macOS-desktop-themed portfolio, including colour tokens, typography, spacing, CSS Modules conventions, shared global classes (os-btn, hand-heading-2, popup-*), and motion. Use whenever creating or restyling a component, adding colours/fonts/shadows, or when the UI looks inconsistent.
---

# UI design system

The site imitates a modern macOS desktop: frosted windows, traffic lights, a dock, and Apple
system type. Every new piece of UI should look like it ships with that OS. Consistency is the
single biggest signal of polish.

## Where styles live

| Layer | File | Use for |
|---|---|---|
| Tokens | `src/app/globals.css` `:root` | Colours, font stack, line-height. **The only place raw colour values belong.** |
| Global primitives | `src/app/globals.css` | `.os-window`, `.os-titlebar`, `.os-btn`, `.traffic-*`, `.popup-overlay/.popup-alert/...`, `.hand-heading-1/2`, `.container`, `.notebook-bg`, `.window-content-scroll`, `.desktop-grid` |
| Component styles | `src/components/<Name>.module.css` | Layout and styling local to one component |

Rules:
1. **Reuse before you create.** Buttons are `className="os-btn"`, section titles are
   `hand-heading-2`, alerts use the `popup-*` classes.
2. **No raw hex in CSS modules.** Use `var(--token)`. If a needed colour has no token, add one
   to `:root` with a semantic name (`--text-secondary`, not `--grey-555`) and use it.
3. **No inline `style={{…}}`** for static styling; move it to the module. Inline styles are OK
   only for values computed at runtime (window size, drag position, per-icon `dotColor`).
4. Class names in modules are camelCase (`styles.cardHeader`), matching existing files.

## Current debt to pay down when touching these files

- Hard-coded greys repeated across modules (`#555555`, `#333333`, `#666`, `#8e8e93`,
  `#a0a0a5`) → add `--text-secondary` / `--text-tertiary` tokens.
- `#316ac5` and `#4f9eea` duplicate the role of `--ink-blue` → consolidate into one accent token.
- `Contact.tsx`, `Hero.tsx` and `Experience.tsx` carry inline styles (including a repeated
  font-family). Move them into their modules; the font already comes from `--font-system`.
- `globals.css` forces `font-family: var(--font-system) !important` on `*`. Keep the stack but
  drop `!important` once nothing fights it.

## Tokens (extend, don't fork)

```css
/* Suggested additions to :root */
--text-secondary: #6e6e73;     /* Apple secondary label */
--text-tertiary: #8e8e93;
--accent: var(--ink-blue);
--radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px;   /* macOS window ≈ 10–12px */
--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px;
--shadow-window: 0 22px 70px 4px rgba(0,0,0,.56), 0 0 0 1px rgba(0,0,0,.1);
--ease-out: cubic-bezier(.2,.8,.2,1);
```

## Typography

- One family: the system stack (`--font-system`). No extra web fonts unless they add something
  real, and then only via `next/font`.
- Scale (rem): 0.8125 caption · 0.9375 secondary · 1.05 body (current) · 1.25 h3 · 1.75 h2 · 2.5+ h1.
- Line length 60–80ch for paragraphs inside windows. Body line-height `var(--line-height)`.
- Weight carries hierarchy (600 for titles, 400 for body). Avoid ALL CAPS for anything longer
  than a short button label.

## Colour and contrast

- Text on `--paper-bg` must be ≥ 4.5:1. `#8e8e93` on white is about 3.3:1, so it fails for
  body text and is fine only for large or decorative text.
- Traffic lights keep their macOS colours (`#FF5F56`, `#FFBD2E`, `#27C93F`). Tokenise them as
  `--traffic-red/yellow/green` if you touch them.
- `color-scheme: light` is declared. If dark mode is added, redefine tokens under
  `@media (prefers-color-scheme: dark)` only. Components should not change.

## Motion

- framer-motion for enter/exit (`AnimatePresence`) and drag; CSS transitions for hover/press.
- Durations: 150–250ms for UI feedback, ≤ 400ms for window open/close. Use spring or ease-out
  curves; no linear easing on UI.
- Animate `transform` and `opacity` only (not width/height/top/left) for 60fps.
- Every animation must respect `prefers-reduced-motion` (see `accessibility-audit`).

## Review checklist for a new or changed component

- [ ] Uses existing global classes where one fits
- [ ] No raw hex / px colours outside `:root`; no static inline styles
- [ ] Spacing and radii are on the scale
- [ ] Hover, `:active`, and `:focus-visible` states all designed
- [ ] Looks right at 375px, 768px, 1280px and 1920px (see `responsive-design`)
- [ ] Contrast checked; motion respects reduced-motion
