// Haptic feedback, phone layout only. Two mechanisms, because browsers differ:
// - Android (Chrome, Samsung Internet): the Vibration API, with a short pulse per kind.
// - iPhone (Safari 18+): there is no Vibration API, but toggling an <input type="checkbox" switch>
//   plays the system's own selection haptic, so a hidden switch is clicked. Safari only plays it
//   during a real tap, so calls made later (after an await) are silent on iPhone.
// The hidden switch sits in a closed shadow root: analytics autocapture records clicks on labels and
// inputs, and from outside the shadow root these synthetic clicks only reach an anonymous span.
import { PHONE_QUERY } from "@/hooks/useIsMobile";

// light: a tap on a control · selection: a tab, page or toggle changed · medium: opening something
// big (a prototype) · success: an action completed (copied, shared)
export type HapticKind = "light" | "selection" | "medium" | "success";

const PULSE: Record<HapticKind, number | number[]> = {
  selection: 6,
  light: 10,
  medium: 18,
  success: [12, 70, 14],
};

let toggle: HTMLLabelElement | null = null;

function iosTick() {
  if (!toggle) {
    const host = document.createElement("span");
    host.setAttribute("aria-hidden", "true");
    host.style.display = "none";
    const root = host.attachShadow({ mode: "closed" });
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    label.append(input);
    root.append(label);
    document.body.append(host);
    toggle = label;
  }
  toggle.click();
}

export function haptic(kind: HapticKind = "light") {
  if (typeof window === "undefined" || !window.matchMedia(PHONE_QUERY).matches) return;
  if (typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(PULSE[kind]);
    } catch {
      // blocked (no recent tap, or vibration turned off): stay silent
    }
    return;
  }
  // Safari supports the `switch` attribute; elsewhere there is no haptic to play
  if (!("switch" in HTMLInputElement.prototype)) return;
  iosTick();
  // The iPhone haptic is a single tick, so success taps twice
  if (kind === "success") window.setTimeout(iosTick, 90);
}
