// Amplitude and Firebase load after the page is up, so analytics never competes with the first screen
// on a phone. Everything goes through `analyticsReady()`: events sent earlier wait for it and arrive in
// order, after init.
import type * as Amplitude from "@amplitude/unified";

// Amplitude ingestion key — public by design; move to an env var when you set up environments.
const AMPLITUDE_API_KEY = "dc827971b83b7855a855679307cb39c1";
const IDLE_TIMEOUT_MS = 2500;

type Clients = {
  amplitude: typeof Amplitude;
  logFirebaseEvent: typeof import("@/lib/firebase").logFirebaseEvent;
};

let clients: Promise<Clients> | null = null;

function pageSettled() {
  return new Promise<void>((resolve) => {
    const idle = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
      else setTimeout(resolve, IDLE_TIMEOUT_MS);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export function analyticsReady() {
  clients ??= pageSettled().then(async () => {
    const [amplitude, { getFirebaseAnalytics, logFirebaseEvent }] = await Promise.all([import("@amplitude/unified"), import("@/lib/firebase")]);
    amplitude.initAll(AMPLITUDE_API_KEY, { analytics: { autocapture: true }, sessionReplay: { sampleRate: 1 } });
    getFirebaseAnalytics().then(() => logFirebaseEvent("app_initialized", { app_name: "mandar_portfolio" }));
    return { amplitude, logFirebaseEvent };
  });
  return clients;
}
