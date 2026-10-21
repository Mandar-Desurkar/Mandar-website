// Tracking plan: the single source of truth for every explicit Amplitude event.
// Amplitude is initialized in src/instrumentation-client.ts, which also sends "Viewed Home Page".
// Autocapture already records page views, sessions and raw clicks, so these events only name
// product moments autocapture can't: which section, from where, for how long, and why.
// Naming: Title Case, past-tense action. Add new events here first so the plan stays complete.
import * as amplitude from "@amplitude/unified";
import { logFirebaseEvent } from "@/lib/firebase";
import type { OpenSource, SectionId } from "@/context/WindowContext";

export type MusicTrigger = "autoplay" | "first_interaction" | "play_button" | "unmute" | "media_key" | "track_change";

export type AnalyticsEvents = {
  // Funnel: did visitors get past the intro?
  "Completed Boot Screen": Record<string, never>;

  // Navigation: which content, reached through which entry point
  "Opened Section": {
    section: SectionId;
    source: OpenSource;
    previous_section: SectionId;
    window_was_open: boolean;
  };
  // Engagement: dwell time per section, sent when it stops being visible
  "Left Section": {
    section: SectionId;
    seconds_visible: number;
    reason: "switched" | "closed" | "minimized" | "page_hidden";
  };
  "Opened System Menu": Record<string, never>;

  // Window chrome: do visitors play with the desktop metaphor?
  "Closed Window": { section: SectionId };
  "Minimized Window": { section: SectionId };
  "Maximized Window": { section: SectionId };
  "Restored Window": { section: SectionId };
  "Moved Window": { section: SectionId };
  "Resized Window": { section: SectionId; width: number; height: number };

  // Conversion nudge: one-time "open to PM roles" notification
  "Viewed Hiring Notification": { seconds_on_site: number };
  "Clicked Hiring Notification": { action: "lets_talk" };
  "Dismissed Hiring Notification": { method: "close_button" | "timeout" };

  // Interactive app prototypes (e.g. Kissan Sampurna)
  "Opened Prototype": { prototype: string; placement: "hero" | "experience" | "projects" };
  "Viewed Prototype Screen": {
    prototype: string;
    flow: string;
    screen: string;
    method: "tap" | "next_button" | "prev_button" | "list" | "keyboard" | "restart" | "cross_flow";
  };
  "Closed Prototype": { prototype: string; screens_viewed: number; seconds_open: number };

  // Conversion: the north star
  "Clicked Contact Method": { method: "email" | "linkedin" | "phone"; placement: "contact_window" | "hero" };
  "Opened Resume": { placement: "hero" };
  "Clicked External Link": {
    link_type: "school_map" | "project" | "app_website";
    label: string;
    placement?: "hero_icon" | "hero_chip";
  };

  // Music widget
  "Played Music": { track_title: string; trigger: MusicTrigger };
  "Paused Music": { track_title: string; trigger: "pause_button" | "media_key"; seconds_into_track: number };
  "Unmuted Music": { track_title: string; seconds_into_track: number };
  "Muted Music": { track_title: string; seconds_into_track: number };
  "Skipped Track": {
    from_track: string;
    to_track: string;
    direction: "next" | "previous";
    trigger: "button" | "media_key";
  };
  "Restarted Track": { track_title: string; trigger: "button" | "media_key" };
  "Seeked Track": { track_title: string; from_seconds: number; to_seconds: number; method: "pointer" | "keyboard" };
  "Finished Track": { track_title: string };
  "Opened Product Notes": { track_title: string };
  "Closed Product Notes": { method: "done" | "escape" };
  "Failed to Load Track": { track_title: string; src: string };

  // Friction: how often real visitors hit the anti-copy / anti-inspect guards
  "Hit Content Protection": {
    action: "context_menu" | "copy" | "devtools_shortcut" | "view_source_shortcut" | "screenshot_shortcut";
  };
};

export function trackEvent<E extends keyof AnalyticsEvents>(event: E, properties: AnalyticsEvents[E]) {
  if (typeof window === "undefined") return; // client-only; analytics isn't initialized on the server
  amplitude.track(event, properties);

  // Also log to Firebase Analytics (convert "Viewed Prototype Screen" -> "viewed_prototype_screen")
  const firebaseEventName = event.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  logFirebaseEvent(firebaseEventName, properties as Record<string, string | number | boolean | undefined>);
}

export const secondsSince = (start: number) => Math.round((performance.now() - start) / 1000);
