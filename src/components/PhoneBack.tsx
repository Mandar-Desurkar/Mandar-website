"use client";

// The phone's Back button. Back closes whatever is open (a prototype, a section, Search) and lands on
// the home screen; on home the first press warns and the second leaves the site.
//
// A site can't close itself, so this works through history: a guard entry sits above the page, and each
// open layer adds one more. Popping the guard shows the warning and leaves us on the page's real entry,
// where the next Back is the browser's own and exits. Browsers skip entries added before the visitor has
// interacted, so the guard goes in on the first tap, and again on any tap after a warning.
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useWindow } from "@/context/WindowContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./PhoneBack.module.css";

const TOAST_MS = 2000;

// history.state keeps the Next.js router's own fields, or Next reloads the page on Back
const push = () => window.history.pushState(window.history.state, "");

export default function PhoneBack() {
  const { isClosed, setIsClosed, prototype, closePrototype, searchOpen, setSearchOpen } = useWindow();
  const isMobile = useIsMobile();
  const [warning, setWarning] = useState(false);

  const depth = (isClosed ? 0 : 1) + (prototype ? 1 : 0) + (searchOpen ? 1 : 0);
  const depthRef = useRef(depth);
  const armed = useRef(false);
  const layers = useRef(0); // layer entries currently above the guard
  const ignorePop = useRef(false);

  const closeTop = useEffectEvent(() => {
    if (searchOpen) setSearchOpen(false);
    else if (prototype) closePrototype();
    else setIsClosed(true);
  });

  const showWarning = useCallback(() => {
    setWarning(true);
    window.setTimeout(() => setWarning(false), TOAST_MS);
  }, []);

  // Keep history in step when something opens or closes on screen
  useEffect(() => {
    depthRef.current = depth;
    if (!isMobile || !armed.current) return;
    if (depth > layers.current) {
      for (let i = layers.current; i < depth; i++) push();
    } else if (depth < layers.current) {
      ignorePop.current = true;
      window.history.go(depth - layers.current);
    }
    layers.current = depth;
  }, [depth, isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    const arm = () => {
      if (armed.current) return;
      armed.current = true;
      push();
      for (let i = 0; i < depthRef.current; i++) push();
      layers.current = depthRef.current;
    };

    const onPop = () => {
      if (ignorePop.current) {
        ignorePop.current = false;
        return;
      }
      if (!armed.current) return;
      if (layers.current > 0) {
        layers.current -= 1;
        closeTop();
      } else {
        // Off the guard and onto the page's own entry: one more Back leaves the site
        armed.current = false;
        showWarning();
      }
    };

    window.addEventListener("click", arm, true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("click", arm, true);
      window.removeEventListener("popstate", onPop);
    };
  }, [isMobile, showWarning]);

  if (!warning) return null;
  return (
    <div className={styles.toast} role="status">
      Press back again to exit
    </div>
  );
}
