"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BootScreen.module.css";
import { Monitor } from "lucide-react";
import { profile } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";

const PHONE_QUERY = "(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse)";
const DESKTOP_MS = 1750; // long enough for the sunrise to finish
const PHONE_MS = 1250;

export default function BootScreen() {
  const [isBooting, setIsBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Force scroll to top when page loads
    window.scrollTo(0, 0);
    const isPhone = window.matchMedia(PHONE_QUERY).matches;

    // The phone's progress bar: 50ms * 20 = 1000ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    const timeout = setTimeout(() => {
      trackEvent("Completed Boot Screen", {});
      setIsBooting(false);
    }, isPhone ? PHONE_MS : DESKTOP_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          className={styles.bootScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Desktop: sunrise over a dark Earth. CSS picks the layout,
              so a phone never flashes the wrong one before hydration. */}
          <div className={styles.sunrise} aria-hidden="true">
            <div className={styles.planet} />
            <div className={styles.sun} />
          </div>
          <p className={styles.name}>{profile.name}</p>

          {/* Phone: boots like an iPhone, a white glyph and a thin progress bar on black */}
          <div className={styles.content}>
            <Monitor size={64} className={styles.icon} aria-hidden="true" />
            <div className={styles.progressContainer}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
