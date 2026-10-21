---
name: add-portfolio-section
description: Step-by-step workflow for adding, renaming, or removing a section (window/tab) in this macOS-desktop-style portfolio, e.g. "add a Blog section", "add Skills", "add a Resume window", or "remove Education". Covers every file that must change together so the desktop icon, dock, window title, window size, and content stay in sync.
argument-hint: "<section-id> <Title>"
---

# Add a portfolio section

The site is one page that pretends to be a desktop. A "section" is a **tab id** held in
`WindowContext.activeTab`. Opening one renders a component inside `DraggableWindow`. The id is a
bare string repeated across several files, so a missed spot fails silently (falls through to
`<Hero />` or shows no dock dot).

Use a lowercase kebab id, e.g. `skills`, `case-studies`.

## Checklist: touch all of these

1. **Content component**: `src/components/<Name>.tsx` + `<Name>.module.css`
   - Copy the structure of an existing one (`Projects.tsx` is the cleanest template):
     `<section id="<id>" className={styles.<id>Section}>` → header box with
     `<h2 className="hand-heading-2">` → body.
   - Put list data in a typed array at the top of the file, or in `src/data/<id>.ts` if it is
     long or reused.
   - Styles use tokens from `globals.css` (`var(--ink-black)`, `var(--ink-blue)`, …). No new
     hard-coded hex values unless you also add a token. See `ui-design-system`.

2. **Router switch**: `src/app/page.tsx`
   - `ActiveSection()`: add `case '<id>': return <Name />;`
   - `WindowTitle()`: add `case '<id>': return '<Title>';`
   - `DesktopEnvironment()`: add a `<DesktopIcon id="<id>" title="<Title>" dotColor="…" icon={…} />`.
     Folder SVGs live in `public/icons/`. Check the file size first; several are multi-MB (see
     `performance-audit`).

3. **Window size**: `src/components/DraggableWindow.tsx`
   - The `useEffect` on `activeTab` has a `switch` that sets width/height per tab. Add a case,
     or the window keeps the default `60vw × 70vh`.

4. **Dock**: `src/components/Dock.tsx`
   - Add a `dockItem` that calls `handleIconClick('<id>', '<Title>')`, with a lucide icon, a
     tooltip, and the active-dot class expression (copy an existing item verbatim and change
     the id in **all three** places in it).
   - Add an `.iconBg` colour class in `Dock.module.css` if needed.

5. **Navbar**: grep `src/components/Navbar.tsx` for existing ids and add a menu entry if the
   others have one.

6. **Context type** (recommended hardening): in `src/context/WindowContext.tsx`, replace
   `activeTab: string` with a union:
   ```ts
   export type TabId = 'about' | 'experience' | 'education' | 'projects' | 'contact' /* | '<id>' */;
   ```
   and type `setActiveTab: (tab: TabId) => void`. TypeScript then flags every place an id is
   misspelled or missing. Do this once, then each new section only adds to the union.

## Find every reference before finishing

```bash
grep -rn "'projects'" src/   # use an existing id to see every wiring point
grep -rn "'<id>'" src/       # your new id should appear in the same files
```

## Verify

- `npx tsc --noEmit && npm run lint`
- In the browser (`npm run dev`): double-click the desktop icon (≥768px), single tap it on a
  narrow viewport (<768px), click the dock item, then minimise, restore, close, and reopen.
  Check the dock dot lights up and the window title matches.
- Run `accessibility-audit` and `responsive-design` checks on the new section.

## Removing a section

Do the same list in reverse, then delete the component, its CSS module, and any icon that
nothing references any more (`grep -rn "FolderN.svg" src/`).
