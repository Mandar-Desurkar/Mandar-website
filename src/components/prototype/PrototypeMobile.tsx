"use client";

// Phone layout of the prototype viewer (< 768px). The visitor's phone *is* the device, so the app
// screen fills the display edge to edge instead of a scaled-down iPhone mock. A slim top bar
// (close · app/flow · flows) and a bottom bar (‹ · screen + PM note · ›) frame it, and the flow list
// and PM notes open as bottom sheets. State and analytics stay in PrototypeViewer.
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ListTree, RotateCcw, Smartphone, X } from "lucide-react";
import styles from "./PrototypeMobile.module.css";
import { lato } from "./fonts";
import type { Prototype } from "@/data/prototypes/kissanSampurna";

const DESIGN_W = 375; // screens are built for a 375pt-wide phone
const MAX_W = 430;
const HINT_KEY = "prototype-mobile-hint-seen";

type Props = {
  prototype: Prototype;
  flowIndex: number;
  screenIndex: number;
  direction: number;
  children: ReactNode; // the current screen
  onPrev: () => void;
  onNext: () => void;
  onJump: (flow: number, screen: number) => void;
  onRestart: () => void;
  onClose: () => void;
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
};

// The prototypes are portrait phone apps: a phone held sideways gets a rotate prompt instead
const LANDSCAPE = "(orientation: landscape) and (pointer: coarse)";
const subscribeLandscape = (cb: () => void) => {
  const mql = window.matchMedia(LANDSCAPE);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};

const APPS = [
  { id: "kissan-sampurna" as const, label: "🌾 Kissan Sampurna" },
  { id: "gau-sampurna" as const, label: "🐄 Gau Sampurna" },
];

export default function PrototypeMobile({
  prototype,
  flowIndex,
  screenIndex,
  direction,
  children,
  onPrev,
  onNext,
  onJump,
  onRestart,
  onClose,
  onSwitchPrototype,
}: Props) {
  const flow = prototype.flows[flowIndex];
  const screen = flow.screens[screenIndex];
  const [sheet, setSheet] = useState<"flows" | "note" | null>(null);
  const [hint, setHint] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [expandedFlow, setExpandedFlow] = useState(flowIndex);
  const landscape = useSyncExternalStore(subscribeLandscape, () => window.matchMedia(LANDSCAPE).matches, () => false);

  // Fit the app screen to the stage: full width up to 430pt; narrower phones scale the 375pt
  // design down so layouts keep their proportions.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // One-time coach mark: what is tappable and where the notes live
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setHint(true), 600);
    const hide = setTimeout(() => {
      setHint(false);
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {}
    }, 5200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Esc closes the open sheet first, then the viewer (PrototypeViewer handles the viewer)
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setSheet(null);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [sheet]);

  const scale = size.w && size.w < DESIGN_W ? size.w / DESIGN_W : 1;
  const innerW = size.w < DESIGN_W ? DESIGN_W : Math.min(size.w, MAX_W);
  const innerH = size.h / scale;
  const isFirst = screenIndex === 0;
  const isLast = screenIndex === flow.screens.length - 1;
  // The bottom bar is the main way through on a phone, so it carries on across flows
  const hasPrevFlow = flowIndex > 0;
  const hasNextFlow = flowIndex < prototype.flows.length - 1;
  const goPrev = () => {
    if (!isFirst) onPrev();
    else if (hasPrevFlow) onJump(flowIndex - 1, prototype.flows[flowIndex - 1].screens.length - 1);
  };
  const goNext = () => {
    if (!isLast) onNext();
    else if (hasNextFlow) onJump(flowIndex + 1, 0);
  };

  const openFlows = () => {
    setExpandedFlow(flowIndex);
    setSheet("flows");
  };

  return (
    <div className={styles.root} role="dialog" aria-modal="true" aria-label={`${prototype.name} interactive prototype`}>
      <header className={styles.topBar}>
        <button ref={closeRef} type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close prototype">
          <X size={20} />
        </button>
        <button type="button" className={styles.titleBtn} onClick={openFlows} aria-label="Switch flow or app">
          <span className={styles.titleApp}>
            {prototype.name}
            <ChevronDown size={14} />
          </span>
          <span className={styles.titleFlow}>{flow.title}</span>
        </button>
        <button type="button" className={styles.iconBtn} onClick={openFlows} aria-label="All flows">
          <ListTree size={19} />
        </button>
      </header>

      <div className={styles.stage} ref={stageRef}>
        {size.w > 0 && (
          <div className={styles.screenSlot} style={{ width: innerW * scale, height: size.h }}>
            <div
              className={`${styles.screen} ${lato.variable}`}
              style={{ width: innerW, height: innerH, transform: scale < 1 ? `scale(${scale})` : undefined }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={`${flow.id}/${screen.id}`}
                  className={styles.slide}
                  initial={{ x: direction * 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction * -40, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
        {landscape && (
          <div className={styles.rotate} role="status">
            <Smartphone size={40} className={styles.rotateIcon} />
            <b>Rotate your phone</b>
            <span>{prototype.name} is a portrait phone app. Turn your phone upright to try it.</span>
          </div>
        )}
        <AnimatePresence>
          {hint && !landscape && (
            <motion.button
              type="button"
              className={styles.hint}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={() => setHint(false)}
            >
              <span className={styles.hintDot} />
              Tap the glowing areas to move through the app. The PM note for each screen is below.
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <footer className={styles.bottomBar}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrev}
          disabled={isFirst && !hasPrevFlow}
          aria-label={isFirst ? "Previous flow" : "Previous screen"}
        >
          <ChevronLeft size={22} />
        </button>
        <button type="button" className={styles.noteBtn} onClick={() => setSheet("note")} aria-label="Show PM note for this screen">
          <span className={styles.noteCount}>
            {screenIndex + 1} / {flow.screens.length}
          </span>
          <span className={styles.noteTitle}>{screen.title}</span>
          <span className={styles.noteCta}>PM note</span>
        </button>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={goNext}
          disabled={isLast && !hasNextFlow}
          aria-label={isLast ? `Next flow: ${hasNextFlow ? prototype.flows[flowIndex + 1].title : ""}` : "Next screen"}
        >
          <ChevronRight size={22} />
        </button>
      </footer>

      <AnimatePresence>
        {sheet && (
          <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)}>
            <motion.div
              className={styles.sheet}
              role="dialog"
              aria-label={sheet === "flows" ? "Flows" : "PM note"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.grabber} />
              <div className={styles.sheetHead}>
                <b>{sheet === "flows" ? "Flows" : flow.title}</b>
                <button type="button" className={styles.sheetClose} onClick={() => setSheet(null)} aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              {sheet === "note" ? (
                <div className={styles.sheetBody}>
                  <span className={styles.noteMeta}>
                    Screen {screenIndex + 1} of {flow.screens.length}
                  </span>
                  <b className={styles.noteHeading}>{screen.title}</b>
                  <p className={styles.noteText}>{screen.note}</p>
                  <div className={styles.chips} role="list">
                    {flow.screens.map((sc, si) => (
                      <button
                        key={sc.id}
                        type="button"
                        role="listitem"
                        className={`${styles.chip} ${si === screenIndex ? styles.chipOn : ""}`}
                        onClick={() => onJump(flowIndex, si)}
                        aria-current={si === screenIndex ? "step" : undefined}
                      >
                        {si + 1}. {sc.title}
                      </button>
                    ))}
                  </div>
                  <button type="button" className={styles.restart} onClick={onRestart}>
                    <RotateCcw size={15} /> Restart this flow
                  </button>
                </div>
              ) : (
                <div className={styles.sheetBody}>
                  {onSwitchPrototype && (
                    <div className={styles.segment} role="tablist" aria-label="App">
                      {APPS.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          role="tab"
                          aria-selected={a.id === prototype.id}
                          className={`${styles.segBtn} ${a.id === prototype.id ? styles.segOn : ""}`}
                          onClick={() => a.id !== prototype.id && onSwitchPrototype(a.id)}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <ul className={styles.flowList}>
                    {prototype.flows.map((f, fi) => {
                      const open = fi === expandedFlow;
                      return (
                        <li key={f.id}>
                          <button
                            type="button"
                            className={`${styles.flowRow} ${fi === flowIndex ? styles.flowCurrent : ""}`}
                            onClick={() => setExpandedFlow(open ? -1 : fi)}
                            aria-expanded={open}
                          >
                            <span className={styles.flowText}>
                              <b>{f.title}</b>
                              <small>{f.summary}</small>
                            </span>
                            <span className={styles.flowCount}>{f.screens.length}</span>
                            <ChevronDown size={16} className={open ? styles.rotated : undefined} />
                          </button>
                          {open && (
                            <ul className={styles.screenList}>
                              {f.screens.map((sc, si) => {
                                const current = fi === flowIndex && si === screenIndex;
                                return (
                                  <li key={sc.id}>
                                    <button
                                      type="button"
                                      className={`${styles.screenRow} ${current ? styles.screenOn : ""}`}
                                      onClick={() => {
                                        onJump(fi, si);
                                        setSheet(null);
                                      }}
                                      aria-current={current ? "step" : undefined}
                                    >
                                      <span>{si + 1}</span>
                                      {sc.title}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
