import localFont from "next/font/local";

// The typefaces the two apps bundle (SIL OFL, see fonts/OFL.txt and fonts/Poppins-OFL.txt), as
// Latin-subset WOFF2. Not preloaded: they are only needed once a visitor opens a prototype.

// Lato: every Kissan Sampurna screen and nearly all of Gau Sampurna. The apps map weights onto Lato
// files as 500 → Regular, 600 → Bold and 800/900 → Black (code/global/fonts.js), and the browser's
// weight matching does the same with these three faces.
export const lato = localFont({
  src: [
    { path: "./fonts/Lato-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Lato-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Lato-Black.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-lato",
});

// Poppins: Gau Sampurna's Account and Edit Profile screens (account-screen.jsx, profile-screen.jsx).
export const poppins = localFont({
  src: [
    { path: "./fonts/Poppins-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  preload: false,
  variable: "--font-poppins",
});
