"use client";

// A macOS Mission Control-style overview of every window on the desktop: the five sections and the two
// app prototypes, side by side as previews. It is the first-visit introduction (after the loader) and
// comes back from the "Show all windows" button in the menu bar (event `mission-control-open`).
// Motion teaches the model: the open window shrinks from where it is into its tile, every other tile
// grows out of its desktop icon, a pick zooms into the real window, and leaving sends each tile back
// home. Reduced motion gets a plain fade. Desktop only. Previews are screenshots in public/mission-control/ (720px wide, re-capture when a
// window's design changes).
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useWindow, type PrototypeId, type SectionId } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import styles from "./MissionControl.module.css";

const SEEN_KEY = "mission-control-seen";
// After the sunrise loader (1.75s) and its fade
const START_AFTER_MS = 2300;

// What a window does, shown when its preview is hovered or the tour stops on it: a scroll through a tall
// capture, a click on a real control and its result, or the app's screens in turn. x / y are % of the preview.
type Peek =
  | { kind: "scroll"; src: string; width: number; height: number; to: number }
  | { kind: "click"; x: number; y: number; after: string }
  | { kind: "slides"; srcs: string[] };

type Item = {
  key: string;
  label: string;
  note: string;
  // The one thing to try there, shown while it peeks
  action: string;
  image: string;
  width: number;
  height: number;
  section?: SectionId;
  prototype?: PrototypeId;
  badge?: string;
  peek: Peek;
};

const P = "/mission-control/peek";
const ITEMS: Item[] = [
  { key: "about", label: "About Me", note: "Who I am, in one window", action: "Tap an app name to try it", image: "/mission-control/about.webp", width: 720, height: 680, section: "about", peek: { kind: "click", x: 41.6, y: 81.1, after: "/mission-control/kissan-sampurna.webp" } },
  { key: "experience", label: "Experience", note: "Roles and the products I shipped", action: "Scroll down to the swimming story", image: "/mission-control/experience.webp", width: 720, height: 541, section: "experience", peek: { kind: "scroll", src: `${P}/experience-tall.webp`, width: 640, height: 1865, to: 61.2 } },
  { key: "projects", label: "Case Studies", note: "Three features, problem to outcome", action: "Open a case study to read it in full", image: "/mission-control/projects.webp", width: 720, height: 541, section: "projects", badge: "Start here", peek: { kind: "click", x: 13.8, y: 53.4, after: `${P}/case-study.webp` } },
  { key: "education", label: "Education", note: "Degree, school and toolkit", action: "Scroll down to skills and tools", image: "/mission-control/education.webp", width: 720, height: 541, section: "education", peek: { kind: "scroll", src: `${P}/education-tall.webp`, width: 720, height: 845, to: 36 } },
  { key: "contact", label: "Contact", note: "Email, phone and LinkedIn", action: "Copy my email in one click", image: "/mission-control/contact.webp", width: 720, height: 589, section: "contact", peek: { kind: "click", x: 63.7, y: 48.9, after: `${P}/contact-copied.webp` } },
  { key: "kissan", label: "Kissan Sampurna", note: "Interactive app prototype", action: "Tap through the real app", image: "/mission-control/kissan-sampurna.webp", width: 720, height: 450, prototype: "kissan-sampurna", peek: { kind: "slides", srcs: [`${P}/kissan-2.webp`, `${P}/kissan-3.webp`] } },
  { key: "gau", label: "Gau Sampurna", note: "Interactive app prototype", action: "Tap through the real app", image: "/mission-control/gau-sampurna.webp", width: 720, height: 450, prototype: "gau-sampurna", peek: { kind: "slides", srcs: [`${P}/gau-2.webp`, `${P}/gau-3.webp`] } },
];

// The first-visit tour: every window in the order the grid shows them (left to right, top row then
// bottom), starting at About Me, one action each, then it opens About Me
const TOUR = ["about", "experience", "projects", "education", "contact", "kissan", "gau"];
const STOP_MS = 3000;
// Let the previews land and the badge pop before the first stop
const TOUR_START_MS = 1300;
// Resting on a preview this long starts its peek, so sweeping across the grid doesn't trigger them all
const PEEK_DELAY_MS = 450;

// The peek itself: CSS animations restart because the layer mounts fresh for each peek
function PeekLayer({ peek }: { peek: Peek }) {
  if (peek.kind === "scroll") {
    return (
      <span className={styles.peek} aria-hidden="true">
        <Image
          src={peek.src}
          alt=""
          width={peek.width}
          height={peek.height}
          sizes="440px"
          className={styles.peekScroll}
          style={{ ["--to" as string]: `-${peek.to}%` }}
        />
      </span>
    );
  }
  if (peek.kind === "click") {
    return (
      <span className={styles.peek} aria-hidden="true">
        <Image src={peek.after} alt="" fill sizes="440px" className={styles.peekAfter} />
        <span className={styles.ripple} style={{ left: `${peek.x}%`, top: `${peek.y}%` }} />
        <span className={styles.cursor} style={{ left: `${peek.x}%`, top: `${peek.y}%` }}>
          <svg width="18" height="22" viewBox="0 0 20 24">
            <path d="M1 1 L13 13 L8.5 13.5 L11.5 20.5 L9 21.5 L6 14.5 L2 18 Z" fill="#000" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    );
  }
  return (
    <span className={styles.peek} aria-hidden="true">
      {peek.srcs.map((src, i) => (
        <Image key={src} src={src} alt="" fill sizes="440px" className={styles.peekSlide} style={{ animationDelay: `${0.9 + i * 1}s` }} />
      ))}
    </span>
  );
}

type Trigger = "first_visit" | "menu_bar";

// The largest preview height at which every window fits on screen, wrapping into rows like the grid's
// flex-wrap does. Matches the grid's insets and gaps in MissionControl.module.css.
const GAP_X = 34;
const GAP_Y = 26;
const LABEL_H = 50; // frame margin, title and note under each preview
const MIN_TILE_W = 150; // the note sets a minimum width under narrow previews
function fitTileHeight(vw: number, vh: number) {
  const W = vw - 80;
  const H = vh - 132 - 28;
  for (let h = 250; h > 90; h -= 5) {
    let rows = 1;
    let x = 0;
    for (const it of ITEMS) {
      const w = Math.max(MIN_TILE_W, (h * it.width) / it.height);
      if (x > 0 && x + GAP_X + w > W) {
        rows += 1;
        x = w;
      } else x += (x > 0 ? GAP_X : 0) + w;
    }
    if (rows * (h + LABEL_H) + (rows - 1) * GAP_Y <= H) return h;
  }
  return 90;
}

// Where each preview comes from and goes back to: its desktop icon (DesktopIcon sets data-icon)
const iconRect = (it: Item) =>
  document.querySelector(`[data-icon="${it.section ?? it.prototype}"] > div`)?.getBoundingClientRect() ?? null;
const openWindowRect = () => document.querySelector(".os-window.absolute-window")?.getBoundingClientRect() ?? null;

const EASE = [0.2, 0.8, 0.2, 1] as const;

// The transform that puts a frame at `to`, centred and scaled to its width
function offsetTo(frame: DOMRect, to: DOMRect) {
  return {
    x: to.left + to.width / 2 - (frame.left + frame.width / 2),
    y: to.top + to.height / 2 - (frame.top + frame.height / 2),
    scale: to.width / frame.width,
  };
}

export default function MissionControl() {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const { openSection, openPrototype, activeTab, isClosed, isMinimized } = useWindow();
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [tileH, setTileH] = useState(200);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLSpanElement | null)[]>([]);
  const texts = useRef<(HTMLSpanElement | null)[]>([]);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  // Captured when the overview opens: which section window was on screen (it flies into its tile)
  const [openAtStart, setOpenAtStart] = useState<SectionId | null>(null);
  // The preview playing its peek (hover or keyboard focus), and the tour when it runs
  const [peekKey, setPeekKey] = useState<string | null>(null);
  const [tour, setTour] = useState<{ i: number; t: number; paused: boolean } | null>(null);
  const tourRef = useRef(tour);
  const peekTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const peeked = useRef(new Set<string>());
  const keyboard = useRef(false);

  const show = useCallback(
    (how: Trigger) => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpenAtStart(!isClosed && !isMinimized ? activeTab : null);
      closing.current = false;
      if (how === "first_visit") {
        try {
          localStorage.setItem(SEEN_KEY, "1"); // on open, so it can never come back on its own
        } catch {
          // private mode: it may show again next visit, which is harmless
        }
      }
      document.documentElement.dataset.tour = "on"; // holds back the hiring banner
      peeked.current.clear();
      setPeekKey(null);
      setTour(null);
      trackEvent("Opened Mission Control", { trigger: how });
      setTileH(fitTileHeight(window.innerWidth, window.innerHeight));
      setTrigger(how);
    },
    [activeTab, isClosed, isMinimized],
  );

  const finishClose = useCallback(() => {
    delete document.documentElement.dataset.tour;
    delete document.documentElement.dataset.mc;
    window.dispatchEvent(new Event("desktop-tour-end")); // the hiring banner may show now
    setTrigger(null);
  }, []);

  // Leaving. A pick zooms that preview toward the centre and hands over to the real window; anything
  // else sends every preview back to its icon (and the open window back to where it was).
  const close = useCallback(
    (how: { picked: Item } | { method: "escape" | "background" | "button" }) => {
      if (!trigger || closing.current) return;
      closing.current = true;
      overlayRef.current?.setAttribute("data-closing", "");
      const how_ = trigger;
      const picked = "picked" in how ? how.picked : null;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const jobs: { finished: Promise<unknown> }[] = [];

      if ("picked" in how) {
        trackEvent("Picked From Mission Control", { item: how.picked.key, kind: how.picked.section ? "section" : "prototype", trigger: how_ });
        // The window changes underneath while still hidden, so it is ready when the preview lands
        if (how.picked.section) openSection(how.picked.section, "mission_control");
      } else {
        trackEvent("Closed Mission Control", { method: how.method, trigger: how_ });
      }

      ITEMS.forEach((it, i) => {
        const frame = frames.current[i];
        const text = texts.current[i];
        if (!frame) return;
        if (text) jobs.push(animate(text, { opacity: 0 }, { duration: 0.15 }));
        if (reduceMotion) {
          jobs.push(animate(frame, { opacity: 0 }, { duration: 0.2 }));
          return;
        }
        const r = frame.getBoundingClientRect();
        if (picked) {
          if (it.key === picked.key) {
            // Grow toward where the window opens: centred under the menu bar, most of the screen
            const target = picked.prototype
              ? new DOMRect(0, 0, vw, vh)
              : new DOMRect(vw * 0.2, 50 + (vh - 70) * 0.12, vw * 0.6, (vh - 70) * 0.76);
            const t = offsetTo(r, target);
            jobs.push(animate(frame, { x: t.x, y: t.y, scale: Math.min(t.scale, target.height / r.height), opacity: [1, 1, 0] }, { duration: 0.42, ease: EASE }));
          } else {
            jobs.push(animate(frame, { scale: 0.92, opacity: 0 }, { duration: 0.25, ease: EASE }));
          }
          return;
        }
        // Back home: the window that was open returns to its place, the rest into their icons
        const home = it.section && it.section === openAtStart ? openWindowRect() : iconRect(it);
        if (!home) {
          jobs.push(animate(frame, { opacity: 0 }, { duration: 0.2 }));
          return;
        }
        const t = offsetTo(r, home);
        const isWindow = it.section === openAtStart;
        jobs.push(
          animate(frame, { x: t.x, y: t.y, scale: t.scale, opacity: isWindow ? 1 : [1, 1, 0] }, { duration: 0.38, delay: isWindow ? 0 : 0.02 * i, ease: EASE }),
        );
      });
      if (backdropRef.current) jobs.push(animate(backdropRef.current, { opacity: 0 }, { duration: picked ? 0.35 : 0.38 }));
      // The badge sets its own opacity when it pops in, so it has to be faded here rather than in CSS
      const badge = overlayRef.current?.querySelector("[data-mc-badge]");
      if (badge) jobs.push(animate(badge, { opacity: 0 }, { duration: 0.1 }));
      const header = overlayRef.current?.querySelectorAll("header, [data-mc-done]");
      header?.forEach((el) => jobs.push(animate(el, { opacity: 0 }, { duration: 0.15 })));

      // The real window reappears as its preview arrives
      setTimeout(() => delete document.documentElement.dataset.mc, picked ? 260 : 330);
      Promise.all(jobs.map((j) => j.finished)).then(() => {
        if (picked?.prototype) openPrototype(picked.prototype, "mission_control");
        if (!picked) returnFocus.current?.focus?.({ preventScroll: true });
        finishClose();
      });
    },
    [trigger, reduceMotion, openAtStart, openSection, openPrototype, finishClose],
  );

  const startPeek = useCallback((key: string) => {
    clearTimeout(peekTimer.current);
    peekTimer.current = setTimeout(() => {
      setPeekKey(key);
      if (!peeked.current.has(key)) {
        peeked.current.add(key);
        trackEvent("Peeked Window", { item: key });
      }
    }, PEEK_DELAY_MS);
  }, []);
  const stopPeek = useCallback(() => {
    clearTimeout(peekTimer.current);
    setPeekKey(null);
  }, []);

  const endTour = useCallback((method: "escape" | "end_button" | "picked") => {
    const t = tourRef.current;
    if (!t) return;
    trackEvent("Stopped Overview Tour", { stop: t.i + 1, method });
    setTour(null);
  }, []);

  useEffect(() => {
    tourRef.current = tour;
  }, [tour]);

  // During the tour, keyboard focus follows the window being shown, so only one preview ever looks
  // selected and Enter opens the window on screen
  const tourStop = tour?.i;
  useEffect(() => {
    if (tourStop == null) return;
    const i = ITEMS.findIndex((it) => it.key === TOUR[tourStop]);
    gridRef.current?.querySelectorAll<HTMLElement>("button")[i]?.focus({ preventScroll: true });
  }, [tourStop]);

  // The tour clock: each stop plays its peek for STOP_MS, then the next; the last opens About Me
  const running = !!tour && !tour.paused;
  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      const t = tourRef.current;
      if (!t || t.paused) return;
      const elapsed = t.t + 100;
      if (elapsed < STOP_MS) setTour({ ...t, t: elapsed });
      else if (t.i < TOUR.length - 1) setTour({ i: t.i + 1, t: 0, paused: false });
      else {
        clearInterval(tick);
        trackEvent("Completed Overview Tour", {});
        setTour(null);
        close({ picked: ITEMS[0] });
      }
    }, 100);
    return () => clearInterval(tick);
  }, [running, close]);

  // A first visit plays the tour by itself; any click or Esc takes over
  useEffect(() => {
    if (trigger !== "first_visit") return;
    const timer = setTimeout(() => {
      if (closing.current) return;
      trackEvent("Started Overview Tour", {});
      setTour({ i: 0, t: 0, paused: false });
    }, TOUR_START_MS);
    return () => clearTimeout(timer);
  }, [trigger]);

  // The timers and listeners below call the latest `show` without re-arming when it changes
  const showRef = useRef(show);
  useEffect(() => {
    showRef.current = show;
  }, [show]);

  // First visit: after the loader, unless the visitor came for something specific (a section or a prototype link)
  useEffect(() => {
    if (isMobile) return;
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.has("prototype") || params.has("section")) return;
    const timer = setTimeout(() => {
      if (document.visibilityState === "visible" && !window.matchMedia("(max-width: 767.98px)").matches) showRef.current("first_visit");
    }, START_AFTER_MS);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // The menu bar button
  useEffect(() => {
    const onOpen = () => showRef.current("menu_bar");
    window.addEventListener("mission-control-open", onOpen);
    return () => window.removeEventListener("mission-control-open", onOpen);
  }, []);

  // Arriving: measured before the first paint, so nothing flashes in its final place first
  useLayoutEffect(() => {
    if (!trigger) return;
    const anims: { stop: () => void }[] = [];
    if (backdropRef.current) anims.push(animate(backdropRef.current, { opacity: [0, 1] }, { duration: 0.3 }));
    overlayRef.current?.querySelectorAll("header, [data-mc-done]").forEach((el) =>
      anims.push(animate(el, { opacity: [0, 1], y: [-6, 0] }, { duration: 0.35, delay: 0.15, ease: EASE })),
    );

    ITEMS.forEach((it, i) => {
      const frame = frames.current[i];
      const text = texts.current[i];
      if (!frame) return;
      const settle = () => {
        frame.style.transform = ""; // hand hover and focus back to the stylesheet
      };
      if (reduceMotion) {
        anims.push(animate(frame, { opacity: [0, 1] }, { duration: 0.2 }));
        if (text) anims.push(animate(text, { opacity: [0, 1] }, { duration: 0.2 }));
        return;
      }
      const r = frame.getBoundingClientRect();
      const isWindow = !!it.section && it.section === openAtStart;
      const from = isWindow ? openWindowRect() : iconRect(it);
      if (from) {
        const t = offsetTo(r, from);
        const a = animate(
          frame,
          { x: [t.x, 0], y: [t.y, 0], scale: [t.scale, 1], opacity: isWindow ? [1, 1] : [0, 1, 1] },
          { duration: isWindow ? 0.5 : 0.55, delay: isWindow ? 0 : 0.06 + 0.035 * i, ease: EASE },
        );
        a.finished.then(settle);
        anims.push(a);
      } else {
        anims.push(animate(frame, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.4, delay: 0.035 * i, ease: EASE }));
      }
      if (text) anims.push(animate(text, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3, delay: 0.35 + 0.035 * i, ease: EASE }));
    });

    // The recommendation lands last, once everything else has settled
    const badge = overlayRef.current?.querySelector("[data-mc-badge]");
    if (badge && !reduceMotion) anims.push(animate(badge, { scale: [0, 1.15, 1], opacity: [0, 1, 1] }, { duration: 0.45, delay: 0.75, ease: EASE }));

    // Hide the real window: its preview has taken its place
    document.documentElement.dataset.mc = "on";
    return () => anims.forEach((a) => a.stop());
    // Runs once per opening: openAtStart is set in the same update as trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, reduceMotion]);

  // Keep the previews sized to the screen while it is open
  useEffect(() => {
    if (!trigger) return;
    const onResize = () => setTileH(fitTileHeight(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [trigger]);

  // Focus the recommended window on a first visit (the open one otherwise); arrows move between windows,
  // Tab stays inside, Esc goes back to the desktop. Captured, so Esc doesn't also close the window underneath.
  useEffect(() => {
    if (!trigger) return;
    const tiles = () => [...(gridRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
    // A first visit starts where the tour starts; later, on the window that was open
    const startKey = trigger === "first_visit" ? TOUR[0] : (openAtStart ?? "about");
    const focusTimer = setTimeout(() => {
      const list = tiles();
      (list[ITEMS.findIndex((it) => it.key === startKey)] ?? list[0])?.focus({ preventScroll: true });
    }, 80);
    const onKey = (e: KeyboardEvent) => {
      keyboard.current = true;
      const t = tourRef.current;
      if (t) {
        // During the tour: Esc ends it (and stays here), space pauses, arrows step
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          endTour("escape");
          return;
        }
        if (e.key === " ") {
          e.preventDefault();
          setTour({ ...t, paused: !t.paused });
          return;
        }
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const i = Math.min(TOUR.length - 1, Math.max(0, t.i + (e.key === "ArrowRight" ? 1 : -1)));
          setTour({ i, t: 0, paused: t.paused });
          return;
        }
      }
      const buttons = [...(overlayRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
      const list = tiles();
      const i = list.indexOf(document.activeElement as HTMLElement);
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close({ method: "escape" });
      } else if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key) && list.length) {
        e.preventDefault();
        const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
        list[(Math.max(i, 0) + step + list.length) % list.length].focus();
      } else if (e.key === "Tab" && buttons.length) {
        const j = buttons.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && j <= 0) {
          e.preventDefault();
          buttons[buttons.length - 1].focus();
        } else if (!e.shiftKey && j === buttons.length - 1) {
          e.preventDefault();
          buttons[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [trigger, close, openAtStart, endTour]);

  // A pointer user isn't steering with the keyboard, so focus alone shouldn't start peeks
  useEffect(() => {
    if (!trigger) return;
    const onPointer = () => {
      keyboard.current = false;
    };
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("pointermove", onPointer, true);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("pointermove", onPointer, true);
    };
  }, [trigger]);

  if (isMobile || !trigger) return null;
  const currentSection = openAtStart;
  const active = tour ? TOUR[tour.i] : peekKey;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-paused={tour?.paused ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mc-title"
      onClick={(e) => e.target === e.currentTarget && close({ method: "background" })}
    >
      <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />

      <header className={styles.header}>
        <h2 id="mc-title" className={styles.title}>
          {trigger === "first_visit" ? "Everything on my desktop" : "All windows"}
        </h2>
        <p className={styles.sub}>
          {tour
            ? "A quick look at each window. Click one to open it, or press Esc."
            : trigger === "first_visit"
              ? "Each window is a part of my work. Hover one to see what it does, or pick it to open it."
              : "Hover a window to see what it does, or pick it to open it."}
        </p>
      </header>

      <button type="button" className={styles.done} data-mc-done onClick={() => close({ method: "button" })}>
        Go to desktop <kbd>esc</kbd>
      </button>

      <div
        ref={gridRef}
        className={styles.grid}
        data-peeking={active ? "" : undefined}
        style={{ ["--tile-h" as string]: `${tileH}px` }}
        onClick={(e) => e.target === e.currentTarget && close({ method: "background" })}
      >
        {ITEMS.map((it, i) => (
          <button
            key={it.key}
            type="button"
            className={styles.tile}
            data-peek={active === it.key ? "" : undefined}
            onClick={() => {
              if (tour) endTour("picked");
              close({ picked: it });
            }}
            onMouseEnter={() => !tour && startPeek(it.key)}
            onMouseLeave={() => !tour && stopPeek()}
            onFocus={() => !tour && keyboard.current && startPeek(it.key)}
            onBlur={() => !tour && stopPeek()}
            aria-current={it.section && it.section === currentSection ? "true" : undefined}
            aria-label={`${it.label}: ${it.note}`}
          >
            <span
              ref={(el) => {
                frames.current[i] = el;
              }}
              className={styles.frame}
            >
              <Image src={it.image} alt="" width={it.width} height={it.height} sizes="400px" priority />
              {active === it.key && <PeekLayer key={tour ? `tour-${tour.i}` : "hover"} peek={it.peek} />}
              {it.badge && (
                <span className={styles.badge} data-mc-badge>
                  {it.badge}
                </span>
              )}
            </span>
            <span
              ref={(el) => {
                texts.current[i] = el;
              }}
              className={styles.text}
            >
              <span className={styles.label}>
                {it.label}
                {it.section && it.section === currentSection && <span className={styles.openDot}>Open</span>}
              </span>
              <span className={styles.note}>{active === it.key ? it.action : it.note}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
