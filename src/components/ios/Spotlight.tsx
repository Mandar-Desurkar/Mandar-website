"use client";

// iOS Spotlight, opened from the "Search" pill above the home-screen dock: one search over the apps I
// built (they open the prototypes), the portfolio sections and the ways to reach me. Matches on titles
// and on keywords pulled from the resume (companies, products, skills), so "CRM" finds Projects and
// "Figma" finds Education. Return opens the first result; Esc or Cancel closes.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { IoChevronForward, IoCloseCircle, IoSearch } from "react-icons/io5";
import { useWindow } from "@/context/WindowContext";
import { experiences, profile, projects, shippedApps, skills } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import { AppTile } from "./AppIcon";
import { CONTACT_APPS } from "./contactApps";
import { SECTION_APPS, glyphSize } from "./sections";
import styles from "./Spotlight.module.css";

type Kind = "app" | "section" | "contact";
type Result = {
  id: string;
  kind: Kind;
  title: string;
  subtitle: string;
  keywords: string;
  tile: ReactNode;
  href?: string;
  external?: boolean;
  run?: () => void;
};

const GROUPS: { kind: Kind; title: string }[] = [
  { kind: "app", title: "Apps I've built" },
  { kind: "section", title: "Portfolio" },
  { kind: "contact", title: "Get in touch" },
];

const current = experiences.find((e) => !e.isFuture);
const SECTION_SUBTITLES: Record<string, string> = {
  about: `${profile.role} · ${profile.location}`,
  experience: current ? `${current.role}, ${current.company.replace(/ Private Limited$/, "")}` : "Roles",
  education: "B.E. ISE · Skills & toolkit",
  projects: projects.map((p) => p.title).join(" · "),
  contact: "Email, phone, LinkedIn",
};
const SECTION_KEYWORDS: Record<string, string> = {
  experience: experiences.map((e) => `${e.role} ${e.company} ${e.groups?.map((g) => g.title).join(" ") ?? ""}`).join(" "),
  education: skills.map((s) => s.items).join(" "),
  projects: projects.map((p) => `${p.title} ${p.context} ${p.tags.join(" ")}`).join(" "),
};

export default function Spotlight({ onClose }: { onClose: () => void }) {
  const { openSection, openPrototype } = useWindow();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const all = useMemo<Result[]>(
    () => [
      ...shippedApps.map((app) => ({
        id: app.prototype ?? app.name,
        kind: "app" as const,
        title: app.name,
        subtitle: `${app.caption} · Try the prototype`,
        keywords: "prototype demo app play store agritech",
        tile: <AppTile image={app.icon} size={38} />,
        run: () => app.prototype && openPrototype(app.prototype, "spotlight"),
      })),
      ...SECTION_APPS.map((app) => ({
        id: app.id,
        kind: "section" as const,
        title: app.title,
        subtitle: SECTION_SUBTITLES[app.id],
        keywords: `${app.keywords} ${SECTION_KEYWORDS[app.id] ?? ""}`,
        tile: <AppTile size={38} colors={app.colors} glyph={<app.Glyph size={glyphSize(app)} />} />,
        run: () => openSection(app.id, "spotlight"),
      })),
      ...CONTACT_APPS.map(({ method, title, subtitle, href, external, Glyph, colors }) => ({
        id: method,
        kind: "contact" as const,
        title,
        subtitle,
        keywords: "contact reach hire",
        tile: <AppTile size={38} colors={colors} glyph={<Glyph size="54%" />} />,
        href,
        external,
        run: () => trackEvent("Clicked Contact Method", { method, placement: "spotlight" }),
      })),
    ],
    [openSection, openPrototype],
  );

  const q = query.trim().toLowerCase();
  const results = q ? all.filter((r) => `${r.title} ${r.subtitle} ${r.keywords}`.toLowerCase().includes(q)) : all;

  const select = (r: Result) => {
    trackEvent("Selected Spotlight Result", { result: r.id, kind: r.kind, query_length: q.length });
    r.run?.();
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search">
      <form
        className={styles.bar}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const first = results[0];
          if (!first) return;
          if (first.href) {
            first.run?.();
            if (first.external) window.open(first.href, "_blank", "noopener,noreferrer");
            else window.location.href = first.href;
            onClose();
          } else select(first);
        }}
      >
        <label className={styles.field}>
          <IoSearch size={17} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search the portfolio"
            aria-controls="spotlight-results"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          {query && (
            <button
              type="button"
              className={styles.clear}
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <IoCloseCircle size={18} aria-hidden="true" />
            </button>
          )}
        </label>
        <button type="button" className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
      </form>

      <div id="spotlight-results" className={styles.results} aria-live="polite">
        {GROUPS.map(({ kind, title }) => {
          const rows = results.filter((r) => r.kind === kind);
          if (!rows.length) return null;
          return (
            <section key={kind} className={styles.group}>
              <h2 className={styles.heading}>{title}</h2>
              <ul className={styles.card}>
                {rows.map((r) => {
                  const body = (
                    <>
                      {r.tile}
                      <span className={styles.text}>
                        <span className={styles.title}>{r.title}</span>
                        <span className={styles.subtitle}>{r.subtitle}</span>
                      </span>
                      <IoChevronForward className={styles.chevron} size={16} aria-hidden="true" />
                    </>
                  );
                  return (
                    <li key={r.id}>
                      {r.href ? (
                        <a
                          className={styles.row}
                          href={r.href}
                          onClick={() => select(r)}
                          {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {body}
                        </a>
                      ) : (
                        <button type="button" className={styles.row} onClick={() => select(r)}>
                          {body}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {!results.length && (
          <p className={styles.empty}>
            No Results for “{query.trim()}”
            <span>Try a company, product or skill, like “CRM” or “Figma”.</span>
          </p>
        )}
      </div>
    </div>
  );
}
