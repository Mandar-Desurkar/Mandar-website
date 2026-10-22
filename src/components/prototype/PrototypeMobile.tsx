"use client";

// Phone prototype player (< 768px and touch tablets), modelled on Figma's mobile prototype view:
// the app fills the whole screen like the real app, and the player chrome is a floating pill
// (close · ‹ · screen + PM note · › · flows) that shows on open, auto-hides, and comes back when
// the visitor taps an empty area, which also flashes the hotspots as Figma does. PM notes and the
// flow list open as bottom sheets. State and analytics stay in PrototypeViewer.
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Expand, ListTree, Minimize, RotateCcw, Smartphone, X } from "lucide-react";
import styles from "./PrototypeMobile.module.css";
import { lato, poppins } from "./fonts";
import { fitToPhone } from "./deviceFit";
import type { Prototype } from "@/data/prototypes/kissanSampurna";

const HINT_KEY = "prototype-mobile-hint-seen";
const CHROME_MS = 3500;
// A swipe that starts inside a sideways-only scroller (banner carousel, chips, product rows) must
// scroll that row, not change the screen. Vertical page scrollers don't count.
function inHorizontalScroller(target: EventTarget | null, stop: Element) {
  for (let el = target as HTMLElement | null; el && el !== stop; el = el.parentElement) {
    const st = getComputedStyle(el);
    const scrollsX = (st.overflowX === "auto" || st.overflowX === "scroll") && el.scrollWidth > el.clientWidth + 2;
    const scrollsY = (st.overflowY === "auto" || st.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 2;
    if (scrollsX && !scrollsY) return true;
  }
  return false;
}

const INTERACTIVE = "button, a, input, select, textarea, label, [role='button'], [role='slider'], [role='tab']";

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

// True full screen hides the browser bars; supported on Android Chrome, not on iPhone Safari
const subscribeFullscreen = (cb: () => void) => {
  document.addEventListener("fullscreenchange", cb);
  return () => document.removeEventListener("fullscreenchange", cb);
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
  const [chrome, setChrome] = useState(true);
  const [chromeTick, setChromeTick] = useState(0);
  const [flash, setFlash] = useState(false);
  const [expandedFlow, setExpandedFlow] = useState(flowIndex);
  const [seenFlow, setSeenFlow] = useState(flowIndex);
  const stageRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const landscape = useSyncExternalStore(subscribeLandscape, () => window.matchMedia(LANDSCAPE).matches, () => false);
  const canFullscreen = useSyncExternalStore(subscribeFullscreen, () => document.fullscreenEnabled === true, () => false);
  const isFullscreen = useSyncExternalStore(subscribeFullscreen, () => document.fullscreenElement !== null, () => false);

  const showChrome = () => {
    setChrome(true);
    setChromeTick((t) => t + 1);
  };

  // Entering a new flow brings the controls back briefly so the visitor sees where they are
  if (seenFlow !== flowIndex) {
    setSeenFlow(flowIndex);
    setChrome(true);
    setChromeTick((t) => t + 1);
  }

  // Auto-hide the floating controls (not while a sheet is open)
  useEffect(() => {
    if (!chrome || sheet) return;
    const t = setTimeout(() => setChrome(false), CHROME_MS);
    return () => clearTimeout(t);
  }, [chrome, chromeTick, sheet]);

  // Track the stage size; the screen is fitted to it with the app's own sizing rules (fitToPhone)
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

  // One-time coach mark: how the player works
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setHint(true), 500);
    const hide = setTimeout(() => {
      setHint(false);
      try {
        localStorage.setItem(HINT_KEY, "1");
      } catch {}
    }, 6500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    toolbarRef.current?.querySelector("button")?.focus({ preventScroll: true });
  }, []);

  // Leaving the player also leaves browser full screen
  useEffect(
    () => () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    },
    []
  );

  // Esc closes the open sheet first, then the player (PrototypeViewer handles the player)
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

  // Figma behaviour: tapping a non-interactive spot flashes the hotspots and shows the controls
  const onStageTap = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest(INTERACTIVE)) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 450);
    setHint(false);
    showChrome();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  // Phones: the app fills the screen at the sizes that phone shows in the real app. Tablets: the
  // app's design device, as a card scaled to fit the height.
  const { device } = prototype;
  const isTablet = size.w >= 600;
  const fit = fitToPhone(device, size.w > 0 ? size.w : device.width);
  const scale = isTablet ? Math.min(1, (size.h - 32) / device.height) : fit.scale;
  const innerW = isTablet ? device.width : fit.layoutWidth;
  const innerH = isTablet ? device.height : size.h > 0 ? size.h / scale : device.height;
  const isFirst = screenIndex === 0;
  const isLast = screenIndex === flow.screens.length - 1;
  // The player keeps going across flows, so ‹ › never dead-end mid-prototype
  const hasPrevFlow = flowIndex > 0;
  const hasNextFlow = flowIndex < prototype.flows.length - 1;
  // Swipe left/right between screens. Plain touch events rather than a drag, so the browser's own
  // vertical scrolling and the app's sideways carousels keep working underneath.
  const swipe = useRef<{ x: number; y: number; t: number; blocked: boolean } | null>(null);
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return (swipe.current = null);
    const t = e.touches[0];
    const blocked = inHorizontalScroller(e.target, e.currentTarget) || !!(e.target as HTMLElement).closest("input, textarea, [role='slider']");
    swipe.current = { x: t.clientX, y: t.clientY, t: e.timeStamp, blocked };
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.blocked) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.8 && e.timeStamp - start.t < 700) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  const goPrev = () => {
    showChrome();
    if (!isFirst) onPrev();
    else if (hasPrevFlow) onJump(flowIndex - 1, prototype.flows[flowIndex - 1].screens.length - 1);
  };
  const goNext = () => {
    showChrome();
    if (!isLast) onNext();
    else if (hasNextFlow) onJump(flowIndex + 1, 0);
  };
  const openFlows = () => {
    setExpandedFlow(flowIndex);
    setSheet("flows");
  };

  return (
    <div className={styles.root} role="dialog" aria-modal="true" aria-label={`${prototype.name} interactive prototype`}>
      <div className={styles.stage} ref={stageRef} onClickCapture={onStageTap}>
        {size.w > 0 && (
          <div className={styles.screenSlot} style={{ width: innerW * scale, height: size.h }}>
            <div
              className={`${styles.screen} ${lato.variable} ${poppins.variable} ${flash ? styles.flash : ""}`}
              style={{
                width: innerW,
                height: innerH,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={`${flow.id}/${screen.id}`}
                  className={styles.slide}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
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
      </div>

      {landscape && (
        <div className={styles.rotate} role="status">
          <Smartphone size={40} className={styles.rotateIcon} />
          <b>Rotate your phone</b>
          <span>{prototype.name} is a portrait phone app. Turn your phone upright to try it.</span>
          <button type="button" className={styles.rotateClose} onClick={onClose}>
            Close prototype
          </button>
        </div>
      )}

      {/* Sleek top floating coach mark pill */}
      <AnimatePresence>
        {hint && !landscape && (
          <motion.button
            type="button"
            className={styles.hint}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            onClick={() => setHint(false)}
            aria-label="Dismiss hint"
          >
            <span className={styles.hintDot} />
            <span className={styles.hintText}>
              <b>Figma prototype mode.</b> Tap the glowing areas or swipe sideways to move through the app. Tap
              any empty spot to bring back the controls and PM notes.
            </span>
            <X size={14} className={styles.hintClose} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating player controls: a dark glass pill, like Figma's mobile prototype toolbar */}
      <AnimatePresence>
        {chrome && !sheet && !landscape && (
          <motion.div
            ref={toolbarRef}
            className={styles.toolbar}
            role="toolbar"
            aria-label="Prototype controls"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onPointerDown={showChrome}
          >
            <button type="button" className={styles.tbBtn} onClick={onClose} aria-label="Close prototype" title="Close">
              <X size={18} />
            </button>
            <button
              type="button"
              className={styles.tbBtn}
              onClick={goPrev}
              disabled={isFirst && !hasPrevFlow}
              aria-label={isFirst ? "Previous flow" : "Previous screen"}
              title="Previous screen"
            >
              <ChevronLeft size={20} />
            </button>
            <button type="button" className={styles.tbCenter} onClick={() => setSheet("note")} aria-label="PM note for this screen" title="PM Note & specs">
              <span className={styles.tbFlow}>
                {flow.title} · {screenIndex + 1}/{flow.screens.length}
              </span>
              <span className={styles.tbScreen}>
                <span>{screen.title}</span>
                <em>Note</em>
              </span>
            </button>
            <button
              type="button"
              className={`${styles.tbBtn} ${styles.tbNext}`}
              onClick={goNext}
              disabled={isLast && !hasNextFlow}
              aria-label={isLast ? "Next flow" : "Next screen"}
              title="Next screen"
            >
              <ChevronRight size={20} />
            </button>
            <button type="button" className={`${styles.tbBtn} ${styles.tbOptional}`} onClick={onRestart} aria-label="Restart flow" title="Restart flow">
              <RotateCcw size={16} />
            </button>
            <button type="button" className={styles.tbBtn} onClick={openFlows} aria-label="All flows and screens" title="All flows">
              <ListTree size={18} />
            </button>
            <button type="button" className={`${styles.tbBtn} ${styles.tbOptional}`} onClick={() => setChrome(false)} aria-label="Hide controls" title="Hide toolbar">
              <ChevronDown size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden toolbar leaves a small tab on the right edge, clear of the app's tab bar and header */}
      <AnimatePresence>
        {!chrome && !sheet && !landscape && (
          <motion.button
            type="button"
            className={styles.miniPill}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            onClick={showChrome}
            aria-label={`Show prototype controls (${flow.title}, screen ${screenIndex + 1} of ${flow.screens.length})`}
          >
            <span className={styles.miniDot} />
            <ChevronLeft size={16} className={styles.miniChevron} />
          </motion.button>
        )}
      </AnimatePresence>

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
                <span className={styles.sheetTitle}>
                  <small>{prototype.name}</small>
                  <b>{sheet === "flows" ? "Flows" : flow.title}</b>
                </span>
                <span className={styles.sheetActions}>
                  {sheet === "flows" && canFullscreen && (
                    <button type="button" className={styles.sheetPill} onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize size={14} /> : <Expand size={14} />}
                      {isFullscreen ? "Exit full screen" : "Full screen"}
                    </button>
                  )}
                  <button type="button" className={styles.sheetClose} onClick={() => setSheet(null)} aria-label="Close">
                    <X size={16} />
                  </button>
                </span>
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
                  <div className={styles.noteNav}>
                    <button type="button" className={styles.restart} onClick={onRestart}>
                      <RotateCcw size={15} /> Restart flow
                    </button>
                    <button
                      type="button"
                      className={styles.backToApp}
                      onClick={() => {
                        setSheet(null);
                        setChrome(false);
                      }}
                    >
                      Back to the app
                    </button>
                  </div>
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
