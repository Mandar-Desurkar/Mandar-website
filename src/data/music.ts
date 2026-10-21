// Desktop music widget playlist. Put audio files in public/music/ and list them here.
// Use tracks you own or that are royalty-free / licensed for web use.
// Keep files small: ~128 kbps MP3, ideally under 4 MB each, since they stream after page load.
// If a file is missing, the widget hides itself in production (dev shows a hint).
// track.mp3 is an original synthesized placeholder loop (49s, no samples).

export type Track = {
  src: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string; // optional square image in public/, e.g. "/music/cover.jpg"
  // Commercial track kept out of git (.gitignore) and out of production builds: plays only in
  // local development, so the live site never lists a file it doesn't have.
  localOnly?: boolean;
};

const allTracks: Track[] = [
  {
    // Commercial film song (Sun Pictures). Hosting it publicly needs a license, see PROJECT_CONTEXT.
    src: "/music/one-sun-one-moon.mp3",
    title: "One Sun One Moon",
    artist: "Anirudh",
    album: "Jailer 2",
    cover: "/music/one-sun-one-moon.jpg",
    localOnly: true,
  },
  {
    // Commercial film song (Sun Pictures). Same licensing caveat as above.
    src: "/music/ala-bolelo.mp3",
    title: "Ala Bolelo",
    artist: "Anirudh",
    album: "Jailer 2",
    cover: "/music/ala-bolelo.jpg",
    localOnly: true,
  },
  {
    src: "/music/track.mp3",
    title: "Desktop Lo-fi",
    artist: "Placeholder loop",
    album: "Desktop Sessions",
  },
];

export const tracks: Track[] = allTracks.filter(
  (t) => !t.localOnly || process.env.NODE_ENV !== "production"
);

// Shown on the back of the widget (via the ⓘ button): the product reasoning behind the player.
export const playerNotes = [
  { title: "Muted by design.", body: "Surprise audio is a bad first impression." },
  { title: "Zero cost upfront.", body: "Streams only after the page has loaded." },
  { title: "Respects your choice.", body: "Pause it once and it stays paused next visit." },
];

// Wait for the boot screen (1.25s) and first paint before streaming audio.
export const AUTOPLAY_DELAY_MS = 2000;
