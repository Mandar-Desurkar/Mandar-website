"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import styles from "./PrototypeViewer.module.css";
import { lato } from "./fonts";
import { trackEvent } from "@/lib/analytics";
import type { Prototype } from "@/data/prototypes/kissanSampurna";
import type { ScreenProps } from "./kissan/KissanScreens";
import PrototypeMobile from "./PrototypeMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
};

// Official Figma 5-color Logo
function FigmaLogo() {
  return (
    <svg width="12" height="18" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
    </svg>
  );
}

// Figma Sidebar Toggle Icon [| ]
function SidebarToggleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <line x1="6" y1="2" x2="6" y2="14" />
    </svg>
  );
}

// Figma Restart Icon
function RestartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 8a5.5 5.5 0 1 0 1.2-3.4" />
      <polyline points="2.5 3 2.5 6.5 6 6.5" />
    </svg>
  );
}

// Settings Sliders Icon
function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="2" y1="5" x2="14" y2="5" />
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      <line x1="2" y1="11" x2="14" y2="11" />
      <circle cx="11" cy="11" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Figma Frame (#) Icon
function FigmaFrameIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="1" x2="5" y2="15" />
      <line x1="11" y1="1" x2="11" y2="15" />
      <line x1="1" y1="5" x2="15" y2="5" />
      <line x1="1" y1="11" x2="15" y2="11" />
    </svg>
  );
}

// Figma Home Tab Icon
function FigmaHomeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 6.5L8 2l5.5 4.5v6.5a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1v-6.5z" />
      <path d="M6 14v-4h4v4" />
    </svg>
  );
}

export default function PrototypeViewer({ prototype, screens, onClose, onSwitchPrototype }: Props) {
  const [flowIndex, setFlowIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [scale, setScale] = useState(0.7);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [isFigmaFlashing, setIsFigmaFlashing] = useState(false);
  const [hotspotsEnabled, setHotspotsEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  // Phones get an edge-to-edge layout (PrototypeMobile) instead of the Figma desktop window
  const isMobile = useIsMobile();

  const stageRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedAt = useRef(0);
  const viewed = useRef(new Set<string>());

  const flow = prototype.flows[flowIndex];
  const screen = flow.screens[screenIndex];
  const Screen = screens[screen.id];

  const isKissan = prototype.id === "kissan-sampurna";

  // The live position. A screen that is animating out keeps its old callbacks, so its
  // auto-advance timers could otherwise pull the viewer back to the flow the visitor just left.
  const position = useRef("0/0");

  const goTo = useCallback(
    (targetFlow: number, index: number, method: NavMethod) => {
      if (position.current !== `${flowIndex}/${screenIndex}`) return;
      const f = prototype.flows[targetFlow];
      const target = Math.max(0, Math.min(f.screens.length - 1, index));
      if (targetFlow === flowIndex && target === screenIndex) return;
      setDirection(targetFlow !== flowIndex || target >= screenIndex ? 1 : -1);
      position.current = `${targetFlow}/${target}`;
      setFlowIndex(targetFlow);
      setScreenIndex(target);
      const id = f.screens[target].id;
      viewed.current.add(`${f.id}/${id}`);
      trackEvent("Viewed Prototype Screen", { prototype: prototype.id, flow: f.id, screen: id, method });
    },
    [prototype, flowIndex, screenIndex]
  );

  const next = useCallback(() => goTo(flowIndex, screenIndex + 1, "tap"), [goTo, flowIndex, screenIndex]);
  const back = useCallback(() => goTo(flowIndex, screenIndex - 1, "tap"), [goTo, flowIndex, screenIndex]);
  const restart = useCallback(() => goTo(flowIndex, 0, "restart"), [goTo, flowIndex]);
  const go = useCallback(
    (screenId: string) => {
      const si = prototype.flows[flowIndex].screens.findIndex((sc) => sc.id === screenId);
      if (si !== -1) goTo(flowIndex, si, "tap");
    },
    [goTo, prototype.flows, flowIndex]
  );
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

  // Flash hotspots on non-interactive click
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hotspotsEnabled) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea, [role='button']")) {
      return;
    }
    setIsFigmaFlashing(true);
    setTimeout(() => setIsFigmaFlashing(false), 400);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("prototype", prototype.id);
      navigator.clipboard?.writeText(url.toString()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  useEffect(() => {
    openedAt.current = performance.now();
    viewed.current.add(`${prototype.flows[0].id}/${prototype.flows[0].screens[0].id}`);
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      closeRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [prototype.flows]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTitleDropdownOpen(false);
      }
    };
    if (titleDropdownOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [titleDropdownOpen]);

  useEffect(() => {
    if (!mounted || !stageRef.current) return;
    const el = stageRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(1, (height - 60) / PHONE_H, (width - 40) / PHONE_W));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, sidebarOpen, isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") goTo(flowIndex, screenIndex + 1, "keyboard");
      if (e.key === "ArrowLeft") goTo(flowIndex, screenIndex - 1, "keyboard");
      if (e.key === "r" || e.key === "R") restart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, goTo, flowIndex, screenIndex, restart]);

  if (!mounted) return null;

  if (isMobile) {
    return createPortal(
      <MotionConfig reducedMotion="user">
        <PrototypeMobile
          prototype={prototype}
          flowIndex={flowIndex}
          screenIndex={screenIndex}
          direction={direction}
          onPrev={() => goTo(flowIndex, screenIndex - 1, "prev_button")}
          onNext={() => goTo(flowIndex, screenIndex + 1, "next_button")}
          onJump={(fi, si) => goTo(fi, si, "list")}
          onRestart={restart}
          onClose={close}
          onSwitchPrototype={onSwitchPrototype}
        >
          <Screen next={next} back={back} restart={restart} go={go} goToFlow={goToFlow} />
        </PrototypeMobile>
      </MotionConfig>,
      document.body
    );
  }

  return createPortal(
    <MotionConfig reducedMotion="user">
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onPointerDown={(e) => e.target === e.currentTarget && close()}
      >
        <motion.div
          className={`${styles.window} ${isMaximized ? styles.windowMaximized : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${prototype.name} Figma Prototype Presentation`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {/* ==================== 1. Topmost Figma Tab Strip ==================== */}
          <div className={styles.tabStrip}>
            {/* macOS Window Controls (Traffic Lights) */}
            <div className={styles.windowControls}>
              <button
                type="button"
                className={`${styles.trafficLight} ${styles.trafficRed}`}
                onClick={close}
                aria-label="Close window"
                title="Close"
              />
              <button
                type="button"
                className={`${styles.trafficLight} ${styles.trafficYellow}`}
                onClick={close}
                aria-label="Minimize window"
                title="Minimize"
              />
              <button
                type="button"
                className={`${styles.trafficLight} ${styles.trafficGreen}`}
                onClick={() => setIsMaximized(!isMaximized)}
                aria-label={isMaximized ? "Restore window" : "Maximize window"}
                title={isMaximized ? "Restore" : "Maximize"}
              />
            </div>

            <button type="button" className={styles.homeIconBtn} onClick={close} title="Home / Exit" aria-label="Home">
              <FigmaHomeIcon />
            </button>

            {/* Active or Switchable Prototype Tabs */}
            <button
              type="button"
              className={`${styles.tabItem} ${isKissan ? styles.tabItemActive : ""}`}
              onClick={() => onSwitchPrototype && onSwitchPrototype("kissan-sampurna")}
            >
              <span className={styles.tabPlayIcon}>▶</span>
              <span>Kissan Sampurna App - Prototype</span>
              <span className={styles.tabCloseBtn} onClick={(e) => { e.stopPropagation(); close(); }}>✕</span>
            </button>

            <button
              type="button"
              className={`${styles.tabItem} ${!isKissan ? styles.tabItemActive : ""}`}
              onClick={() => onSwitchPrototype && onSwitchPrototype("gau-sampurna")}
            >
              <span className={styles.tabPlayIcon}>▶</span>
              <span>Gau Sampurna Mobile App - Prototype</span>
              <span className={styles.tabCloseBtn} onClick={(e) => { e.stopPropagation(); close(); }}>✕</span>
            </button>

            <span className={styles.addTabBtn}>+</span>
          </div>

          {/* ==================== 2. Figma Prototype Presentation Bar ==================== */}
          <div className={styles.presentationBar}>
            {/* Left Tools */}
            <div className={styles.navGroupLeft}>
              <div className={styles.figmaLogoWrap}>
                <FigmaLogo />
              </div>

              <button
                type="button"
                className={`${styles.iconBtn} ${sidebarOpen ? styles.iconBtnActive : ""}`}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                aria-label="Toggle Flows sidebar"
              >
                <SidebarToggleIcon />
              </button>

              <button
                type="button"
                className={styles.iconBtn}
                onClick={restart}
                title="Restart prototype flow (Press R)"
                aria-label="Restart prototype"
              >
                <RestartIcon />
              </button>
            </div>

            {/* Centered Prototype Title with Dropdown */}
            <div className={styles.navGroupCenter} ref={dropdownRef}>
              <button
                type="button"
                className={`${styles.centerTitleBtn} ${titleDropdownOpen ? styles.centerTitleBtnActive : ""}`}
                onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                aria-expanded={titleDropdownOpen}
              >
                <span>{prototype.name}</span>
                <span className={`${styles.titleChevron} ${titleDropdownOpen ? styles.titleChevronOpen : ""}`}>▼</span>
              </button>

              {titleDropdownOpen && (
                <div className={styles.projectDropdown}>
                  <div className={styles.dropdownHeader}>Switch Prototype</div>

                  <button
                    type="button"
                    className={`${styles.projectDropdownItem} ${isKissan ? styles.projectDropdownItemActive : ""}`}
                    onClick={() => {
                      if (onSwitchPrototype) onSwitchPrototype("kissan-sampurna");
                      setTitleDropdownOpen(false);
                    }}
                  >
                    <div className={styles.dropdownItemContent}>
                      <span className={styles.dropdownItemTitle}>
                        <span>🌾 Kissan Sampurna App</span>
                        {isKissan && <span style={{ color: "#0d99ff", fontSize: 11 }}>✓</span>}
                      </span>
                      <span className={styles.dropdownItemSubtitle}>Crop Doctor, Crop Guide & Farm Monitoring</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`${styles.projectDropdownItem} ${!isKissan ? styles.projectDropdownItemActive : ""}`}
                    onClick={() => {
                      if (onSwitchPrototype) onSwitchPrototype("gau-sampurna");
                      setTitleDropdownOpen(false);
                    }}
                  >
                    <div className={styles.dropdownItemContent}>
                      <span className={styles.dropdownItemTitle}>
                        <span>🐄 Gau Sampurna Mobile App</span>
                        {!isKissan && <span style={{ color: "#0d99ff", fontSize: 11 }}>✓</span>}
                      </span>
                      <span className={styles.dropdownItemSubtitle}>AI Disease Check & Animal Status</span>
                    </div>
                  </button>

                  <div className={styles.dropdownDivider} />

                  <button
                    type="button"
                    className={styles.dropdownActionItem}
                    onClick={() => {
                      restart();
                      setTitleDropdownOpen(false);
                    }}
                  >
                    <span>Restart flow</span>
                    <span className={styles.dropdownShortcut}>R</span>
                  </button>

                  <button
                    type="button"
                    className={styles.dropdownActionItem}
                    onClick={() => {
                      setSidebarOpen(!sidebarOpen);
                      setTitleDropdownOpen(false);
                    }}
                  >
                    <span>{sidebarOpen ? "Hide flows sidebar" : "Show flows sidebar"}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.dropdownActionItem}
                    onClick={() => {
                      handleShare();
                      setTitleDropdownOpen(false);
                    }}
                  >
                    <span>Copy prototype link</span>
                    <span className={styles.dropdownShortcut}>{copied ? "Copied!" : "Share"}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Tools & Share */}
            <div className={styles.navGroupRight}>
              <div className={styles.avatar} title="Mandar Desurkar">
                MD
              </div>

              <button
                type="button"
                className={`${styles.shareBtn} ${copied ? styles.shareBtnCopied : ""}`}
                onClick={handleShare}
              >
                {copied ? "✓ Link Copied" : "Share prototype"}
              </button>

              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setHotspotsEnabled(!hotspotsEnabled)}
                title={hotspotsEnabled ? "Hotspots enabled (click to toggle)" : "Hotspots disabled"}
              >
                <SettingsIcon />
              </button>

              <button
                ref={closeRef}
                type="button"
                className={styles.closeBtn}
                onClick={close}
                title="Close prototype (Esc)"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ==================== 3. Body: Sidebar + Stage ==================== */}
          <div className={styles.body}>
            {/* Real Figma Flows Sidebar */}
            {sidebarOpen && (
              <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                  <span className={styles.sidebarTitle}>Flows</span>
                  <button
                    type="button"
                    className={styles.sidebarCloseBtn}
                    onClick={() => setSidebarOpen(false)}
                    title="Close sidebar"
                    aria-label="Close sidebar"
                  >
                    ✕
                  </button>
                </div>

                {/* Flows List */}
                <ul className={styles.flowList}>
                  {prototype.flows.map((f, fi) => {
                    const isActive = fi === flowIndex;
                    return (
                      <li key={f.id} className={styles.flowGroup}>
                        <button
                          type="button"
                          className={`${styles.flowItem} ${isActive ? styles.flowItemActive : ""}`}
                          onClick={() => goTo(fi, 0, "list")}
                          title={`Switch to ${f.title} (${f.screens.length} screens)`}
                        >
                          <span className={styles.flowTitleGroup}>
                            {isActive ? (
                              <span className={styles.checkMark}>✓</span>
                            ) : (
                              <span className={styles.checkPlaceholder} />
                            )}
                            <span>{f.title}</span>
                          </span>
                          <span className={styles.screenCountBadge}>
                            {f.screens.length} screens
                          </span>
                        </button>

                        {/* List of screens under the active flow for direct switching */}
                        {isActive && (
                          <ul className={styles.screensSubList}>
                            {f.screens.map((sc, si) => {
                              const isScreenActive = si === screenIndex;
                              return (
                                <li key={sc.id}>
                                  <button
                                    type="button"
                                    className={`${styles.screenBtn} ${isScreenActive ? styles.screenBtnActive : ""}`}
                                    onClick={() => goTo(fi, si, "list")}
                                    title={`Jump to #${si + 1} ${sc.title}`}
                                  >
                                    <span className={styles.screenFrameIcon}>
                                      <FigmaFrameIcon />
                                    </span>
                                    <span className={styles.screenTitleText}>
                                      {si + 1}. {sc.title}
                                    </span>
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

                <div className={styles.flowDivider} />

                {/* Description / PM Note (matching Image 2) */}
                <div className={styles.descriptionSection}>
                  <span className={styles.descHeader}>Description</span>
                  <span className={styles.descScreenTitle}>
                    {screenIndex + 1}. {screen.title}
                  </span>

                  {/* Quick screen jump pills */}
                  <div className={styles.quickPillsRow}>
                    {flow.screens.map((sc, si) => (
                      <button
                        key={sc.id}
                        type="button"
                        className={`${styles.quickPill} ${si === screenIndex ? styles.quickPillActive : ""}`}
                        onClick={() => goTo(flowIndex, si, "list")}
                        title={`Screen ${si + 1}: ${sc.title}`}
                      >
                        {si + 1}
                      </button>
                    ))}
                  </div>

                  <p className={styles.descText}>{screen.note}</p>
                </div>
              </aside>
            )}

            {/* Pure Dark Canvas Stage with Centered iPhone */}
            <div className={styles.stage} ref={stageRef}>
              <div
                className={styles.phoneSlot}
                style={{ width: PHONE_W * scale, height: PHONE_H * scale }}
                onClick={handleStageClick}
              >
                <div className={styles.phone} style={{ transform: `scale(${scale})` }}>
                  <div className={`${styles.screenArea} ${lato.variable}`}>
                    {/* Native iOS Status Bar */}
                    <div className={styles.statusBar} aria-hidden="true">
                      <span>9:41</span>
                      <span className={styles.island} />
                      <span className={styles.statusIcons}>
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

                    {/* Phone Screen Content */}
                    <div className={`${styles.screenContent} ${isFigmaFlashing ? styles.figmaFlash : ""}`}>
                      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                          key={screen.id}
                          className={styles.screenSlide}
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

                    <span className={styles.homeIndicator} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>,
    document.body
  );
}
