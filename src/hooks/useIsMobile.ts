"use client";

import { useSyncExternalStore } from "react";

// Phone layout: below 768px wide (`767.98px` avoids the overlap with `min-width: 768px`), a touch
// tablet in portrait (< 1024px), or a touch screen under 500px tall (a phone in landscape). Drag,
// resize and double-click are mouse interactions, so touch screens get the sheet + dock instead.
// The structural CSS (window sheet, dock, home grid) uses the same query. The server and the first
// client render assume desktop.
const QUERY = "(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
