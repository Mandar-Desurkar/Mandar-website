// Tracking plan: the single source of truth for every explicit Amplitude event.
// Amplitude is initialized in src/instrumentation-client.ts, which also sends "Viewed Home Page".
// Autocapture already records page views, sessions and raw clicks, so these events only name
// product moments autocapture can't: which section, from where, for how long, and why.
// Naming: Title Case, past-tense action. Add new events here first so the plan stays complete.
import { analyticsReady } from "@/lib/analyticsClient";
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
  "Closed Window": { section: SectionId; method?: "button" | "escape" };
  "Minimized Window": { section: SectionId };
  "Maximized Window": { section: SectionId; method?: "button" | "title_double_click" };
  "Restored Window": { section: SectionId; method?: "button" | "title_double_click" };
  "Moved Window": { section: SectionId };
  "Resized Window": { section: SectionId; width: number; height: number };

  // Conversion nudge: one-time "open to PM roles" notification
  "Viewed Hiring Notification": { seconds_on_site: number };
  "Clicked Hiring Notification": { action: "lets_talk" };
  "Dismissed Hiring Notification": { method: "close_button" | "timeout" };

  // Interactive app prototypes (e.g. Kissan Sampurna)
  "Opened Prototype": { prototype: string; placement: "hero" | "desktop" | "experience" | "projects" | "home_screen" | "deep_link" | "spotlight" | "mission_control" };
  "Switched Prototype": { from_prototype: string; to_prototype: string };
  "Shared Prototype": { prototype: string; method: "copy" | "native" };
  "Dismissed Prototype Hint": Record<string, never>;
  // Mission Control overview (MissionControl): the first-visit introduction, and the menu bar button.
  // `item` is which window a visitor picks first: the clearest signal of what recruiters want to see.
  "Opened Mission Control": { trigger: "first_visit" | "menu_bar" };
  "Picked From Mission Control": { item: string; kind: "section" | "prototype"; trigger: "first_visit" | "menu_bar" };
  "Closed Mission Control": { method: "escape" | "background" | "button"; trigger: "first_visit" | "menu_bar" };
  // A preview played its peek (hover or keyboard), once per window per opening
  "Peeked Window": { item: string };
  // The optional tour of the overview: five stops, then About Me
  "Started Overview Tour": Record<string, never>;
  "Completed Overview Tour": Record<string, never>;
  "Stopped Overview Tour": { stop: number; method: "escape" | "end_button" | "picked" };
  // Phone home screen: the iOS Search pill opens Spotlight over the sections, apps and contact actions
  "Opened Spotlight": Record<string, never>;
  // Case studies (the Case Studies window lists them; each is a page at /case-studies/<slug>)
  "Opened Case Study": { slug: string; placement: "case_studies" | "spotlight" | "desktop" };
  "Viewed Case Study": { slug: string };
  "Clicked Case Study CTA": { slug: string; cta: "prototype" | "back" | "source" | "next_case_study" | "contact" | "copy_link" };
  "Clicked Case Study TOC": { slug: string; section: string };
  "Scrolled Case Study": { slug: string; milestone: 25 | 50 | 75 | 100 };
  "Clicked Case Study Footnote": { slug: string; source_id: string };
  // Phone home screen has two pages (apps, then the clock/calendar); page is 1-based
  "Viewed Home Screen Page": { page: number; method: "swipe" | "dots" };
  "Selected Spotlight Result": { result: string; kind: "section" | "app" | "case_study" | "contact"; query_length: number };
  // Mobile section nav bar: native share sheet, or the copied link where sharing isn't supported
  "Shared Profile": { method: "native" | "copy"; section: string };
  "Viewed Prototype Screen": {
    prototype: string;
    flow: string;
    screen: string;
    method: "tap" | "next_button" | "prev_button" | "list" | "keyboard" | "restart" | "cross_flow";
  };
  "Closed Prototype": { prototype: string; screens_viewed: number; seconds_open: number };

  // Beyond Work Photo Lightbox
  "Opened Photo Lightbox": { photo: string; caption: string };
  "Closed Photo Lightbox": { photo: string; method: "click" | "escape" };

  // Conversion: the north star
  "Clicked Contact Method": { method: "email" | "linkedin" | "phone" | "sms" | "vcard" | "copy_email"; placement: "contact_window" | "hero" | "home_widget" | "home_dock" | "spotlight" | "menu_bar" };
  "Opened Resume": { placement: "hero" | "spotlight" | "menu_bar" };
  // The PDF-style resume page (/resume): opened, then downloaded as a file or printed
  "Viewed Resume": Record<string, never>;
  "Downloaded Resume": { method: "download" | "print" };
  "Downloaded vCard": { placement: "contact_window" };
  // Beyond Work: the race video starts playing on the page
  "Played Video": { video: string };
  "Clicked External Link": {
    link_type: "school_map" | "project" | "app_website" | "press";
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
  analyticsReady().then(({ amplitude, logFirebaseEvent }) => {
    amplitude.track(event, properties);

    // Also log to Firebase Analytics (convert "Viewed Prototype Screen" -> "viewed_prototype_screen")
    const firebaseEventName = event.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    logFirebaseEvent(firebaseEventName, properties as Record<string, string | number | boolean | undefined>);
  });
}

export const secondsSince = (start: number) => Math.round((performance.now() - start) / 1000);
