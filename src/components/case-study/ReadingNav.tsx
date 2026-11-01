"use client";

// Wayfinding for a long case study: a thin reading-progress bar under the top bar, and a sticky
// table of contents (wide screens) that highlights the section being read.
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import styles from "./ReadingNav.module.css";

export type TocItem = { id: string; label: string };

export function ReadingProgress({ slug }: { slug?: string }) {
  const [progress, setProgress] = useState(0);
  const trackedMilestones = useRef(new Set<number>());

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? el.scrollTop / max : 0;
      setProgress(Math.min(1, Math.max(0, pct)));

      if (slug) {
        const milestones = [25, 50, 75, 100] as const;
        for (const m of milestones) {
          const threshold = m === 100 ? 0.96 : m / 100;
          if (pct >= threshold && !trackedMilestones.current.has(m)) {
            trackedMilestones.current.add(m);
            trackEvent("Scrolled Case Study", { slug, milestone: m });
          }
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [slug]);

  return (
    <div className={styles.progress} aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

export function TableOfContents({ items, slug }: { items: TocItem[]; slug?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // A section is "current" once its heading passes the upper third of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.toc} aria-label="On this page">
      <p className={styles.tocTitle}>On this page</p>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={item.id === active ? styles.active : undefined}
              aria-current={item.id === active ? "location" : undefined}
              onClick={() => {
                if (slug) {
                  trackEvent("Clicked Case Study TOC", { slug, section: item.id });
                }
              }}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
