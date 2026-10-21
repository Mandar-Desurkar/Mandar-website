"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import styles from "./PrototypeViewer.module.css";
import { lato } from "./fonts";
import { trackEvent } from "@/lib/analytics";
import type { Prototype } from "@/data/prototypes/kissanSampurna";
import type { ScreenProps } from "./kissan/KissanScreens";

// iPhone logical screen + bezel; the whole phone is scaled to fit the stage.
const SCREEN_W = 375;
const SCREEN_H = 812;
const BEZEL = 12;
const PHONE_W = SCREEN_W + BEZEL * 2;
const PHONE_H = SCREEN_H + BEZEL * 2;

type NavMethod = "tap" | "next_button" | "prev_button" | "list" | "keyboard" | "restart" | "cross_flow";

type Props = {
  prototype: Prototype;
  screens: Record<string, ComponentType<ScreenProps>>;
  onClose: () => void;
};

// macOS-style window with the app's flows on the left and a tappable phone on the right.
export default function PrototypeViewer({ prototype, screens, onClose }: Props) {
  const [flowIndex, setFlowIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [scale, setScale] = useState(0.7);
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedAt = useRef(0);
  const viewed = useRef(new Set<string>());

  const flow = prototype.flows[flowIndex];
  const screen = flow.screens[screenIndex];
  const Screen = screens[screen.id];

  const goTo = useCallback(
    (targetFlow: number, index: number, method: NavMethod) => {
      const f = prototype.flows[targetFlow];
      const target = Math.max(0, Math.min(f.screens.length - 1, index));
      if (targetFlow === flowIndex && target === screenIndex) return;
      setDirection(targetFlow !== flowIndex || target >= screenIndex ? 1 : -1);
      setFlowIndex(targetFlow);
      setScreenIndex(target);
      const id = f.screens[target].id;
      viewed.current.add(`${f.id}/${id}`);
      trackEvent("Viewed Prototype Screen", { prototype: prototype.id, flow: f.id, screen: id, method });
    },
    [prototype, flowIndex, screenIndex]
  );

  const next = useCallback(() => goTo(flowIndex, screenIndex + 1, "tap"), [goTo, flowIndex, screenIndex]);
  const restart = useCallback(() => goTo(flowIndex, 0, "restart"), [goTo, flowIndex]);
  const goToFlow = useCallback(
    (flowId: string, screenId?: string) => {
      const fi = prototype.flows.findIndex((f) => f.id === flowId);
      if (fi === -1) return;
      const si = screenId ? prototype.flows[fi].screens.findIndex((sc) => sc.id === screenId) : 0;
      goTo(fi, Math.max(0, si), "cross_flow");
    },
    [goTo, prototype.flows]
  );

  const close = useCallback(() => {
    trackEvent("Closed Prototype", {
      prototype: prototype.id,
      screens_viewed: viewed.current.size,
      seconds_open: Math.round((performance.now() - openedAt.current) / 1000),
    });
    onClose();
  }, [onClose, prototype.id]);

  // Portal target exists only on the client
  useEffect(() => {
    openedAt.current = performance.now();
    viewed.current.add(`${prototype.flows[0].id}/${prototype.flows[0].screens[0].id}`);
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [prototype.flows]);

  // Keep the phone as large as the stage allows
  useEffect(() => {
    if (!mounted || !stageRef.current) return;
    const el = stageRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(1, (height - 72) / PHONE_H, (width - 32) / PHONE_W));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goTo(flowIndex, screenIndex + 1, "keyboard");
      if (e.key === "ArrowLeft") goTo(flowIndex, screenIndex - 1, "keyboard");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, goTo, flowIndex, screenIndex]);

  if (!mounted) return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onPointerDown={(e) => e.target === e.currentTarget && close()}
      >
        <motion.div
          className={styles.window}
          role="dialog"
          aria-modal="true"
          aria-label={`${prototype.name} interactive prototype`}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <div className={styles.titlebar}>
            <div className={styles.lights}>
              <button ref={closeRef} type="button" className={styles.lightClose} onClick={close} aria-label="Close prototype" />
              <span className={styles.lightMin} />
              <span className={styles.lightMax} />
            </div>
            <span className={styles.windowTitle}>{prototype.name} — Prototype</span>
          </div>

          <div className={styles.body}>
            <aside className={styles.sidebar}>
              <div className={styles.appHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prototype.logo} alt="" width={40} height={40} className={styles.appLogo} />
                <div>
                  <p className={styles.appName}>{prototype.name}</p>
                  <p className={styles.appTagline}>{prototype.tagline}</p>
                </div>
              </div>

              {prototype.flows.map((f, fi) => (
                <div key={f.id} className={styles.flow}>
                  <p className={styles.flowTitle}>{f.title}</p>
                  <p className={styles.flowSummary}>{f.summary}</p>
                  <ol className={styles.steps}>
                    {f.screens.map((sc, si) => {
                      const active = fi === flowIndex && si === screenIndex;
                      return (
                        <li key={sc.id}>
                          <button
                            type="button"
                            className={`${styles.step} ${active ? styles.stepActive : ""}`}
                            aria-current={active ? "step" : undefined}
                            onClick={() => goTo(fi, si, "list")}
                          >
                            <span className={styles.stepNum}>{si + 1}</span>
                            {sc.title}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}

              <div className={styles.note} aria-live="polite">
                <p className={styles.noteLabel}>PM note · {screen.title}</p>
                <p className={styles.noteText}>{screen.note}</p>
              </div>
            </aside>

            <div className={styles.stage} ref={stageRef}>
              <div className={styles.phoneSlot} style={{ width: PHONE_W * scale, height: PHONE_H * scale }}>
                <div className={styles.phone} style={{ transform: `scale(${scale})` }}>
                  <div className={`${styles.screenArea} ${lato.variable}`}>
                    <div className={styles.statusBar} aria-hidden="true">
                      <span>9:41</span>
                      <span className={styles.island} />
                      <span className={styles.statusIcons}>
                        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
                        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="16" height="8" rx="1.5" /><rect x="23" y="4" width="1.5" height="4" rx="0.75" opacity="0.4" /></svg>
                      </span>
                    </div>
                    <div className={styles.screenContent}>
                      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                          key={screen.id}
                          className={styles.screenSlide}
                          custom={direction}
                          initial={{ x: direction * 60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: direction * -60, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                        >
                          <Screen next={next} restart={restart} goToFlow={goToFlow} />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <span className={styles.homeIndicator} aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => goTo(flowIndex, screenIndex - 1, "prev_button")}
                  disabled={screenIndex === 0}
                  aria-label="Previous screen"
                >
                  ‹
                </button>
                <span className={styles.counter}>
                  {screenIndex + 1} / {flow.screens.length} · {screen.title}
                </span>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => goTo(flowIndex, screenIndex + 1, "next_button")}
                  disabled={screenIndex === flow.screens.length - 1}
                  aria-label="Next screen"
                >
                  ›
                </button>
              </div>
              <p className={styles.hint}>Tap the glowing button inside the app, or use ← →</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>,
    document.body
  );
}
