"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BootScreen.module.css";
import { profile } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";

const PHONE_QUERY = "(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse)";
// Long enough for the sunrise to play, counted from the start of the page load: the animation is pure
// CSS and has already been running while the code downloaded, so a slow phone doesn't wait twice
const DESKTOP_MS = 1750;
const PHONE_MS = 1200;

export default function BootScreen() {
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Force scroll to top when page loads
    window.scrollTo(0, 0);
    const minimum = window.matchMedia(PHONE_QUERY).matches ? PHONE_MS : DESKTOP_MS;
    const timeout = setTimeout(() => {
      trackEvent("Completed Boot Screen", {});
      setIsBooting(false);
    }, Math.max(0, minimum - performance.now()));
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div
          className={styles.bootScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        >
          {/* A sunrise over a dark Earth, set on the wallpaper's horizon so it opens straight onto it */}
          <div className={styles.sunrise} aria-hidden="true">
            <div className={styles.planet} />
            <div className={styles.sun} />
          </div>
          <p className={styles.name}>{profile.name}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
