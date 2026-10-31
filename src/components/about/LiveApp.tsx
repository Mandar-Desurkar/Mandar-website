"use client";

// A working app inside the About window: the prototype's real screens and navigation in a phone
// frame, without the full-screen viewer around them. Loaded on demand, like the viewer.
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import pv from "@/components/prototype/PrototypeViewer.module.css";
import { lato, poppins } from "@/components/prototype/fonts";
import type { ScreenProps } from "@/components/prototype/kissan/KissanScreens";
import type { Prototype } from "@/data/prototypes/kissanSampurna";
import { trackEvent } from "@/lib/analytics";
import styles from "./LiveApp.module.css";

const BEZEL = 12;

export type LiveAppProps = {
  initialFlow: string;
  initialScreen?: string;
  onFlowChange: (flowId: string) => void;
  onInteract: () => void;
};

type Props = LiveAppProps & {
  prototype: Prototype;
  screens: Record<string, ComponentType<ScreenProps>>;
};

export default function LiveApp({ prototype, screens, initialFlow, initialScreen, onFlowChange, onInteract }: Props) {
  const startFlow = Math.max(0, prototype.flows.findIndex((f) => f.id === initialFlow));
  const startScreen = Math.max(0, prototype.flows[startFlow].screens.findIndex((s) => s.id === initialScreen));
  const [flowIndex, setFlowIndex] = useState(startFlow);
  const [screenIndex, setScreenIndex] = useState(startScreen);
  const [direction, setDirection] = useState(1);
  const [scale, setScale] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  // A screen animating out keeps its old callbacks, so a stale auto-advance timer must not navigate
  const position = useRef(`${startFlow}/${startScreen}`);
  const phoneW = prototype.device.width + BEZEL * 2;
  const phoneH = prototype.device.height + BEZEL * 2;

  const goTo = useCallback(
    (targetFlow: number, index: number) => {
      if (position.current !== `${flowIndex}/${screenIndex}`) return;
      const f = prototype.flows[targetFlow];
      const target = Math.max(0, Math.min(f.screens.length - 1, index));
      if (targetFlow === flowIndex && target === screenIndex) return;
      setDirection(targetFlow !== flowIndex || target >= screenIndex ? 1 : -1);
      position.current = `${targetFlow}/${target}`;
      setFlowIndex(targetFlow);
      setScreenIndex(target);
      if (targetFlow !== flowIndex) onFlowChange(f.id);
      trackEvent("Viewed Prototype Screen", { prototype: prototype.id, flow: f.id, screen: f.screens[target].id, method: "tap" });
    },
    [prototype, flowIndex, screenIndex, onFlowChange],
  );

  const next = useCallback(() => goTo(flowIndex, screenIndex + 1), [goTo, flowIndex, screenIndex]);
  const back = useCallback(() => goTo(flowIndex, screenIndex - 1), [goTo, flowIndex, screenIndex]);
  const restart = useCallback(() => goTo(flowIndex, 0), [goTo, flowIndex]);
  const go = useCallback(
    (screenId: string) => {
      const si = prototype.flows[flowIndex].screens.findIndex((s) => s.id === screenId);
      if (si !== -1) goTo(flowIndex, si);
    },
    [goTo, prototype.flows, flowIndex],
  );
  const goToFlow = useCallback(
    (flowId: string, screenId?: string) => {
      const fi = prototype.flows.findIndex((f) => f.id === flowId);
      if (fi === -1) return;
      const si = screenId ? prototype.flows[fi].screens.findIndex((s) => s.id === screenId) : 0;
      goTo(fi, Math.max(0, si));
    },
    [goTo, prototype.flows],
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / phoneW, height / phoneH));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [phoneW, phoneH]);

  const Screen = screens[prototype.flows[flowIndex].screens[screenIndex].id];
  const screenId = prototype.flows[flowIndex].screens[screenIndex].id;

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={stageRef}
        className={styles.stage}
        onPointerDown={() => {
          onInteract();
          if (opened.current) return;
          opened.current = true;
          trackEvent("Opened Prototype", { prototype: prototype.id, placement: "hero" });
        }}
      >
        <div className={styles.slot} style={{ width: phoneW * scale, height: phoneH * scale }}>
          <div className={`${pv.phone} ${styles.phone}`} style={{ width: phoneW, height: phoneH, transform: `scale(${scale})` }}>
            <div className={`${pv.screenArea} ${lato.variable} ${poppins.variable}`} style={{ width: prototype.device.width, height: prototype.device.height }}>
              <div className={pv.statusBar} aria-hidden="true">
                <span>9:41</span>
                <span className={pv.island} />
                <span className={pv.statusIcons}>
                  <svg width="18" height="12" viewBox="0 0 18 12">
                    <rect x="0" y="8" width="3" height="4" rx="1" />
                    <rect x="5" y="5" width="3" height="7" rx="1" />
                    <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
                    <rect x="15" y="0" width="3" height="12" rx="1" />
                  </svg>
                  <svg width="25" height="12" viewBox="0 0 25 12">
                    <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" opacity="0.4" />
                    <rect x="2" y="2" width="16" height="8" rx="1.5" />
                    <rect x="23" y="4" width="1.5" height="4" rx="0.75" opacity="0.4" />
                  </svg>
                </span>
              </div>
              <div className={pv.screenContent}>
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={screenId}
                    className={pv.screenSlide}
                    custom={direction}
                    initial={{ x: direction * 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction * -50, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Screen next={next} back={back} restart={restart} go={go} goToFlow={goToFlow} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <span className={pv.homeIndicator} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
