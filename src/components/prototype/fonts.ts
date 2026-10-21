import localFont from "next/font/local";

// Lato (SIL OFL, see fonts/OFL.txt): the typeface used in the Kissan Sampurna app.
// Not preloaded: it is only needed once a visitor opens the prototype.
export const lato = localFont({
  src: [
    { path: "./fonts/Lato-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Lato-Bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-lato",
});
