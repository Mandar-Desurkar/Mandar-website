"use client";

// The ERP's frame for a telecaller (DashboardLayout + SoftphoneLayout): top bar with the brand
// switcher, bell and theme toggle; the hamburger sidebar; the floating Exotel softphone; and the
// DispositionGate, which forces a disposition after every call before the agent can move on.
import { createContext, useContext, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Bell, ChevronDown, MicOff, Moon, PhoneOff, RefreshCw, Search, Sun } from "lucide-react";
import styles from "./crm.module.css";
import { useDesktop } from "../web/webMode";
import { crm, MAIN_LEAD, trackCrm, useCrm } from "./crmData";
import { trackEvent } from "@/lib/analytics";
import { DispositionDrawer } from "./CrmDrawers";

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
// A click on something the prototype leaves out: say so, and count it (a demand signal)
export function useUnbuilt() {
  const toast = useToast();
  return (feature: string, message?: string) => {
    trackEvent("Clicked Unbuilt Prototype Feature", { prototype: "sales-crm", feature });
    toast(message ?? `${feature} isn't part of this prototype.`);
  };
}

type ShellProps = {
  children: ReactNode;
  // What the flow does next when the agent hangs up / saves the disposition
  onHangup?: () => void;
  onDisposed?: (sub: string) => void;
  // Draw the eye to Hang up when that is the next step
  hintHangup?: boolean;
};

const NAV = ["Dashboard Overview", "Lead Management", "Order Verification"];

export default function CrmShell({ children, onHangup, onDisposed, hintHangup }: ShellProps) {
  const desktop = useDesktop();
  const s = useCrm();
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const outside = (what: string) => {
    trackEvent("Clicked Unbuilt Prototype Feature", { prototype: "sales-crm", feature: what });
    showToast(`${what} isn't part of this prototype.`);
  };

  return (
    <ToastCtx.Provider value={showToast}>
      <div className={`${styles.root} ${desktop ? "" : styles.mobile}`} data-theme={s.theme}>
        <header className={styles.header}>
          <button type="button" className={styles.burger} onClick={() => setNavOpen(true)} aria-label="Toggle sidebar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className={styles.headRight}>
            <button type="button" className={`${styles.pill} ${styles.platformPill}`} onClick={() => outside("Switching to Kissan Sampurna")}>
              <span className={styles.gsDot}>GS</span>
              Gau Sampurna
              <ChevronDown className={styles.icoSm} />
            </button>
            <button type="button" className={styles.bell} aria-label="Notifications" onClick={() => outside("Notifications")}>
              <Bell />
            </button>
            <button type="button" className={styles.pill} onClick={crm.toggleTheme}>
              {s.theme === "dark" ? <Sun className={`${styles.icoSm} ${styles.sun}`} /> : <Moon className={`${styles.icoSm} ${styles.moon}`} />}
              {desktop && (s.theme === "dark" ? "Light" : "Dark")}
            </button>
          </div>
        </header>

        <main className={styles.main}>{children}</main>

        {/* Sidebar: a telecaller sees only these three pages */}
        {navOpen && <div className={styles.navScrim} onClick={() => setNavOpen(false)} />}
        <aside className={`${styles.nav} ${navOpen ? "" : styles.navClosed}`} aria-hidden={!navOpen}>
          <div className={styles.navHead}>
            <h3>Dashboard</h3>
            <button type="button" className={styles.navClose} onClick={() => setNavOpen(false)} aria-label="Close sidebar">
              ×
            </button>
          </div>
          <div className={styles.navSearch}>
            <Search className={styles.ico} />
            <input placeholder="Search..." aria-label="Search Dashboard" tabIndex={navOpen ? 0 : -1} />
          </div>
          <nav className={styles.navList}>
            {NAV.map((n) => (
              <button
                key={n}
                type="button"
                tabIndex={navOpen ? 0 : -1}
                className={`${styles.navItem} ${n === "Lead Management" ? styles.navItemActive : ""}`}
                onClick={() => (n === "Lead Management" ? setNavOpen(false) : outside(n))}
              >
                {n}
              </button>
            ))}
          </nav>
          <div className={styles.navBtns}>
            <button type="button" tabIndex={navOpen ? 0 : -1} className={styles.navBtn} onClick={() => outside("Change Password")}>
              Change Password
            </button>
            <button type="button" tabIndex={navOpen ? 0 : -1} className={`${styles.navBtn} ${styles.navBtnDanger}`} onClick={() => outside("Logout")}>
              Logout
            </button>
          </div>
        </aside>

        <Softphone
          onHangup={() => {
            crm.hangup();
            onHangup?.();
          }}
          hint={hintHangup}
        />

        {/* DispositionGate: required after every call, no Cancel */}
        {s.call === "ended" && !s.disposed && (
          <DispositionDrawer
            required
            initialDisposition="Connected"
            onClose={() => {}}
            onSave={(d) => {
              crm.dispose(d);
              onDisposed?.(d.sub);
            }}
          />
        )}

        {toast && (
          <div className={styles.toast} role="status">
            {toast}
          </div>
        )}
      </div>
    </ToastCtx.Provider>
  );
}

// SoftphoneWidget: Ready / Reconnect when idle; Mute + Hang up on a call. The status row is a
// drag handle, as in the ERP, so the agent can move it off whatever it covers.
function Softphone({ onHangup, hint }: { onHangup: () => void; hint?: boolean }) {
  const s = useCrm();
  const [muted, setMuted] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const onCall = s.call === "connecting" || s.call === "connected";
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number; k: number } | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  // The viewer scales the screen, so pointer pixels are converted to the screen's own pixels (k)
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    const rr = root.getBoundingClientRect();
    const k = root.offsetWidth / rr.width;
    const er = el.getBoundingClientRect();
    drag.current = { dx: (e.clientX - er.left) * k, dy: (e.clientY - er.top) * k, k };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const root = el?.parentElement;
    if (!drag.current || !el || !root) return;
    const rr = root.getBoundingClientRect();
    const { dx, dy, k } = drag.current;
    const x = Math.max(0, Math.min((e.clientX - rr.left) * k - dx, root.offsetWidth - el.offsetWidth));
    const y = Math.max(0, Math.min((e.clientY - rr.top) * k - dy, root.offsetHeight - el.offsetHeight));
    moved.current = true;
    setPos({ x, y });
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current && moved.current) trackCrm("moved_softphone");
    drag.current = null;
    moved.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const reconnect = () => {
    setReconnecting(true);
    setTimeout(() => setReconnecting(false), 900);
  };

  return (
    <div ref={ref} className={styles.phone} style={pos ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" } : undefined}>
      <div
        className={styles.phoneStatus}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ cursor: "move", touchAction: "none" }}
        title="Drag to move"
      >
        <span className={`${styles.dot} ${reconnecting ? styles.dotBusy : ""}`} />
        Softphone · {reconnecting ? "Connecting…" : "Ready"}
      </div>
      {!onCall && (
        <button type="button" className={styles.phoneBtnWide} onClick={reconnect} disabled={reconnecting}>
          <RefreshCw className={`${styles.icoSm} ${reconnecting ? styles.spin : ""}`} />
          {reconnecting ? "Connecting…" : "Reconnect"}
        </button>
      )}
      {onCall && (
        <div className={styles.phoneCall}>
          <p>
            {s.call === "connecting" ? "Calling" : "On call"} {MAIN_LEAD.mobile}
          </p>
          <div className={styles.phoneBtns}>
            <button type="button" className={`${styles.mute} ${muted ? styles.mutedOn : ""}`} onClick={() => setMuted(!muted)} disabled={s.call !== "connected"}>
              <MicOff className={styles.icoSm} /> {muted ? "Unmute" : "Mute"}
            </button>
            <button type="button" className={`${styles.hang} ${hint ? styles.hangHint : ""}`} onClick={onHangup}>
              <PhoneOff className={styles.icoSm} /> Hang up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
