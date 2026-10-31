// Runs once on the client (Next.js instrumentation-client). Analytics load after the page settles;
// see lib/analyticsClient.ts. The portfolio is a single page, so every load is a home page view.
import { analyticsReady } from "@/lib/analyticsClient";

analyticsReady().then(({ amplitude, logFirebaseEvent }) => {
  amplitude.track("Viewed Home Page", { prompt_version: "BA400.4" });
  logFirebaseEvent("view_home_page", { prompt_version: "BA400.4" });
});
