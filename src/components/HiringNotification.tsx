"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import styles from "./HiringNotification.module.css";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import { hiringNudge, profile } from "@/data/resume";

const SEEN_KEY = "hiring-nudge-seen";
const SHOW_AFTER_MS = 20_000;
const AUTO_DISMISS_MS = 12_000;

// macOS-style banner nudging visitors toward Contact. Shown once per visitor, never to someone
// who already opened Contact, and only while the tab is visible.
export default function HiringNotification() {
  const { openSection, hasOpenedContact } = useWindow();
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const hasOpenedContactRef = useRef(hasOpenedContact);

  useEffect(() => {
    hasOpenedContactRef.current = hasOpenedContact;
  }, [hasOpenedContact]);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {
      return; // can't remember it was shown, so don't risk repeating it
    }
    const startedAt = performance.now();

    const show = () => {
      if (hasOpenedContactRef.current) return; // already converted: don't nag
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // storage blocked after the check above; showing once is still fine
      }
      trackEvent("Viewed Hiring Notification", {
        seconds_on_site: Math.round((performance.now() - startedAt) / 1000),
      });
      setVisible(true);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      show();
    };

    const timer = setTimeout(() => {
      if (document.visibilityState === "visible") show();
      else document.addEventListener("visibilitychange", onVisibilityChange);
    }, SHOW_AFTER_MS);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Auto-dismiss like a macOS banner, but never while the visitor is reading or focused on it.
  useEffect(() => {
    if (!visible || paused) return;
    const timer = setTimeout(() => {
      trackEvent("Dismissed Hiring Notification", { method: "timeout" });
      setVisible(false);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, paused]);

  const dismiss = () => {
    trackEvent("Dismissed Hiring Notification", { method: "close_button" });
    setVisible(false);
  };

  const talk = () => {
    trackEvent("Clicked Hiring Notification", { action: "lets_talk" });
    setVisible(false);
    openSection("contact", "notification");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.region} aria-live="polite">
        <AnimatePresence>
          {visible && (
            <motion.div
              className={styles.banner}
              role="status"
              initial={{ x: 380, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 380, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss notification">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="m2 2 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              <Image
                src="/profile-new.jpg"
                alt=""
                width={38}
                height={38}
                className={styles.avatar}
              />

              <div className={styles.content}>
                <div className={styles.header}>
                  <span className={styles.appName}>{profile.name}</span>
                  <span className={styles.time}>now</span>
                </div>
                <p className={styles.title}>{hiringNudge.title}</p>
                <p className={styles.body}>{hiringNudge.body}</p>
                <button type="button" className={styles.action} onClick={talk}>
                  {hiringNudge.cta}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
