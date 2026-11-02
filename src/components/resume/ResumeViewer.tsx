"use client";

// The PDF viewer around the resume pages: a dark toolbar like a browser's PDF view (file name, page
// counter, zoom, download, print) and a grey canvas. Zoom uses CSS `zoom`, so the pages lay out at their
// scaled size and stay sharp; on a phone they fit the screen width and pinch-zoom works as usual.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Download, Maximize2, Minus, Plus, Printer } from "lucide-react";
import { RESUME_FILE } from "@/data/resumeDocument";
import { trackEvent } from "@/lib/analytics";
import styles from "@/app/resume/Resume.module.css";

const PAGE_W = 816; // US Letter at 96 dpi (8.5in), the LaTeX template's paper
const STEPS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];

export default function ResumeViewer({ children, pages, className }: { children: ReactNode; pages: number; className?: string }) {
  const canvas = useRef<HTMLElement>(null);
  const [zoom, setZoom] = useState(1);
  const [fitMode, setFitMode] = useState(true);
  const [page, setPage] = useState(1);

  // Fit the page to the canvas width, never above 100% (and a little below on phones, for the gutter)
  const fitZoom = useCallback(() => {
    const w = canvas.current?.clientWidth ?? window.innerWidth;
    const gutter = w < 600 ? 16 : 64;
    return Math.min(1, (w - gutter) / PAGE_W);
  }, []);

  useEffect(() => {
    trackEvent("Viewed Resume", {});
  }, []);

  useEffect(() => {
    if (!fitMode) return;
    const apply = () => setZoom(fitZoom());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [fitMode, fitZoom]);

  // The page counter follows whichever page fills the middle of the canvas
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const onScroll = () => {
      const mid = el.getBoundingClientRect().top + el.clientHeight * 0.4;
      const all = [...el.querySelectorAll<HTMLElement>("[data-page]")];
      const current = all.findLast((p) => p.getBoundingClientRect().top <= mid) ?? all[0];
      if (current) setPage(Number(current.dataset.page));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const step = (dir: 1 | -1) => {
    setFitMode(false);
    setZoom((z) => {
      const next = dir > 0 ? STEPS.find((s) => s > z + 0.001) : [...STEPS].reverse().find((s) => s < z - 0.001);
      return next ?? z;
    });
  };

  return (
    <div className={`${styles.viewer} ${className ?? ""}`}>
      <header className={styles.toolbar}>
        <div className={styles.tbLeft}>
          <Link href="/" className={styles.tbButton} aria-label="Back to the portfolio" title="Back to the portfolio">
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
          <span className={styles.file}>Mandar_Desurkar_Resume.pdf</span>
        </div>

        <div className={styles.tbCenter}>
          <span className={styles.pageNo} aria-live="polite">
            <span className={styles.pageBox}>{page}</span> / {pages}
          </span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.zoomGroup}>
            <button type="button" className={styles.tbButton} onClick={() => step(-1)} aria-label="Zoom out" title="Zoom out">
              <Minus size={16} aria-hidden="true" />
            </button>
            <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
            <button type="button" className={styles.tbButton} onClick={() => step(1)} aria-label="Zoom in" title="Zoom in">
              <Plus size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.tbButton}
              onClick={() => setFitMode(true)}
              aria-label="Fit to width"
              title="Fit to width"
              aria-pressed={fitMode}
            >
              <Maximize2 size={15} aria-hidden="true" />
            </button>
          </span>
        </div>

        <div className={styles.tbRight}>
          <a
            href={RESUME_FILE}
            download="Mandar_Desurkar_Resume.pdf"
            className={styles.tbButton}
            aria-label="Download PDF"
            title="Download PDF"
            onClick={() => trackEvent("Downloaded Resume", { method: "download" })}
          >
            <Download size={18} aria-hidden="true" />
          </a>
          <button
            type="button"
            className={`${styles.tbButton} ${styles.print}`}
            onClick={() => {
              trackEvent("Downloaded Resume", { method: "print" });
              window.print();
            }}
            aria-label="Print"
            title="Print"
          >
            <Printer size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <main ref={canvas} className={styles.canvas}>
        {/* Text can be selected and copied here (recruiters paste resumes into their own tools) */}
        <div className={styles.pages} style={{ zoom }} data-allow-copy>
          {children}
        </div>
      </main>
    </div>
  );
}
