"use client";

// One listener gives the phone layout haptic feedback on every route:
// - Buttons, tabs and anything marked `data-haptic` get a tap when pressed.
// - `data-haptic` picks the kind (light, selection, medium or success); "none" opts out.
// - Plain text links stay silent; links that act as buttons carry `data-haptic` (dock icons, case
//   study cards).
// - Only real taps count (`isTrusted`), so the hidden iOS switch in lib/haptics can't trigger itself.
import { useEffect } from "react";
import { haptic, type HapticKind } from "@/lib/haptics";

const TARGETS = '[data-haptic], button, [role="button"], [role="tab"], summary';

export default function Haptics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!e.isTrusted || !(e.target instanceof Element)) return;
      const el = e.target.closest(TARGETS);
      if (!el || el.closest('[data-haptic="none"]') || el.matches(":disabled")) return;
      haptic((el.getAttribute("data-haptic") as HapticKind | null) ?? "light");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
