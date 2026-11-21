"use client";

// Home-screen app icon artwork, drawn the way iOS 26 system icons are built rather than as a stock
// glyph on a gradient. Each icon is one 100×100 SVG with the same layers:
//   1. background: a vertical gradient, lighter at the top, with soft light from the top left
//   2. foreground: white "paper" objects (white fading to a faint tint of the icon colour) that
//      carry one accent detail in a second colour
//   3. depth: a single soft shadow under the foreground, tinted with the background's own dark
//      shade rather than grey, so the object sits on the colour instead of floating
// Foregrounds keep to Apple's icon grid: about 60% of the tile wide, optically centred. The tile's
// squircle mask and glass rim come from AppTile (AppIcon.module.css); this file only draws inside.
import { useId, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa";
import { IoCall } from "react-icons/io5";

type Look = {
  top: string;
  bottom: string;
  // The dark shade the foreground's shadow is tinted with
  shade: string;
  // The accent detail's gradient
  accent?: [string, string];
  // How far the white paper fades toward the icon colour at its foot
  paper?: string;
};

type Ids = { paper: string; accent: string; clip: string };

function Art({ look, children }: { look: Look; children: (id: Ids) => ReactNode }) {
  const u = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id: Ids = { paper: `${u}p`, accent: `${u}a`, clip: `${u}c` };
  const [a0, a1] = look.accent ?? [look.top, look.bottom];
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${u}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.top} />
          <stop offset="1" stopColor={look.bottom} />
        </linearGradient>
        <radialGradient id={`${u}l`} cx="0.25" cy="0" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id.paper} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor={look.paper ?? "#f1f4fa"} />
        </linearGradient>
        <linearGradient id={id.accent} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a0} />
          <stop offset="1" stopColor={a1} />
        </linearGradient>
        <filter id={`${u}s`} x="-25%" y="-25%" width="150%" height="160%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2.2" stdDeviation="2.4" floodColor={look.shade} floodOpacity="0.42" />
        </filter>
      </defs>
      <rect width="100" height="100" fill={`url(#${u}bg)`} />
      <rect width="100" height="100" fill={`url(#${u}l)`} />
      <g filter={`url(#${u}s)`}>{children(id)}</g>
    </svg>
  );
}

const url = (id: string) => `url(#${id})`;

// A stock glyph placed on the icon grid, painted with the paper gradient
const Glyph = ({ Icon, id, box = 56 }: { Icon: IconType; id: Ids; box?: number }) => (
  <Icon x={(100 - box) / 2} y={(100 - box) / 2} size={box} fill={url(id.paper)} />
);

// ---------- Portfolio sections ----------

// About: a profile picture, the silhouette cut off by its circle as in Contacts
export const AboutArt = () => (
  <Art look={{ top: "#6cc6ff", bottom: "#0a6cff", shade: "#003f9e", accent: ["#5cb2ff", "#0a62e6"], paper: "#e3efff" }}>
    {(id) => (
      <>
        <clipPath id={id.clip}>
          <circle cx="50" cy="50" r="31" />
        </clipPath>
        <circle cx="50" cy="50" r="31" fill={url(id.paper)} />
        <g clipPath={url(id.clip)} fill={url(id.accent)}>
          <circle cx="50" cy="42" r="12" />
          <path d="M23 84c0-17 12-26.5 27-26.5S77 67 77 84z" />
        </g>
      </>
    )}
  </Art>
);

// Experience: a briefcase with a lid seam and an orange clasp
export const ExperienceArt = () => (
  <Art look={{ top: "#ffc44d", bottom: "#ff7a00", shade: "#a34700", accent: ["#ffad33", "#ff7f0a"], paper: "#fff0dc" }}>
    {(id) => (
      <>
        <path d="M43 25h14a5 5 0 0 1 5 5v8h-5.5v-7h-13v7H38v-8a5 5 0 0 1 5-5z" fill={url(id.paper)} opacity="0.9" />
        <rect x="19" y="36" width="62" height="41" rx="9" fill={url(id.paper)} />
        <path d="M19 52.5h62" stroke="#f6c992" strokeWidth="1.6" />
        <rect x="42.5" y="47.5" width="15" height="10.5" rx="3" fill={url(id.accent)} />
      </>
    )}
  </Art>
);

// Education: a mortarboard with a gold tassel
export const EducationArt = () => (
  <Art look={{ top: "#a291ff", bottom: "#5536ec", shade: "#2c1499", accent: ["#ffdb5c", "#ffb300"], paper: "#e9e4ff" }}>
    {(id) => (
      <>
        <path d="M31 47v14c0 6.5 8.5 11.5 19 11.5S69 67.5 69 61V47L50 56z" fill={url(id.paper)} opacity="0.86" />
        <path d="M50 24.5 85 40 50 55.5 15 40z" fill={url(id.paper)} stroke={url(id.paper)} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M50 40 75.5 45.5V60" fill="none" stroke={url(id.accent)} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="50" cy="40" r="2.8" fill={url(id.accent)} />
        <rect x="72.7" y="58" width="5.6" height="11.5" rx="2.4" fill={url(id.accent)} />
      </>
    )}
  </Art>
);

// Case Studies: two pages of a report, the front one with a rising bar chart
export const CaseStudiesArt = () => (
  <Art look={{ top: "#65e687", bottom: "#17ad46", shade: "#056b25", accent: ["#3ccc63", "#13963b"], paper: "#e4f7ea" }}>
    {(id) => (
      <>
        <rect x="33" y="19" width="42" height="55" rx="6" fill="#fff" opacity="0.5" transform="rotate(9 54 46.5)" />
        <rect x="26" y="24" width="45" height="57" rx="6.5" fill={url(id.paper)} />
        <rect x="33" y="31.5" width="19" height="4.2" rx="2.1" fill="#b6e6c4" />
        <rect x="33" y="39" width="29" height="3" rx="1.5" fill="#d6f0de" />
        <g fill={url(id.accent)}>
          <rect x="33.5" y="62" width="7.5" height="11" rx="1.8" />
          <rect x="44.75" y="55" width="7.5" height="18" rx="1.8" />
          <rect x="56" y="47" width="7.5" height="26" rx="1.8" />
        </g>
      </>
    )}
  </Art>
);

// Contact: a handshake (a paper plane on teal reads as Telegram). The stroke thickens Phosphor's
// fill weight to match the solid objects on the other icons.
export const ContactArt = () => (
  <Art look={{ top: "#5feadb", bottom: "#079ca6", shade: "#00585f", paper: "#ddf7f6" }}>
    {(id) => (
      <path
        transform="translate(17 14.6) scale(0.258)"
        fill={url(id.paper)}
        stroke={url(id.paper)}
        strokeWidth="9"
        strokeLinejoin="round"
        d="M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l40-40,15.08-15.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41Zm-41.87,41.86L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm-25.72,34.8a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"
      />
    )}
  </Art>
);

// Resume (Spotlight): a page with a folded corner and a red title bar
export const ResumeArt = () => (
  <Art look={{ top: "#ff7a6e", bottom: "#e5312b", shade: "#8f1410", accent: ["#ff6257", "#e2342c"], paper: "#ffe8e6" }}>
    {(id) => (
      <>
        <path d="M30 20h28l15 15v39a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill={url(id.paper)} />
        <path d="M58 20v10a5 5 0 0 0 5 5h10z" fill="#ffc9c4" />
        <rect x="31" y="45" width="22" height="5" rx="2.5" fill={url(id.accent)} />
        <rect x="31" y="55" width="35" height="3.2" rx="1.6" fill="#ffd2cd" />
        <rect x="31" y="63" width="28" height="3.2" rx="1.6" fill="#ffd2cd" />
      </>
    )}
  </Art>
);

// ---------- Dock: ways to reach me ----------

// Notebook: a notes pad with a gold header band and ruled lines, on the site's marigold
export const NotebookArt = () => (
  <Art look={{ top: "#ffd36b", bottom: "#f0a21c", shade: "#8a5200", accent: ["#ffcf4d", "#f5b83d"], paper: "#fff6e0" }}>
    {(id) => (
      <>
        <rect x="27" y="21" width="46" height="58" rx="7" fill={url(id.paper)} />
        <path d="M27 28a7 7 0 0 1 7-7h32a7 7 0 0 1 7 7v6H27z" fill={url(id.accent)} />
        <g fill="#f3dcae">
          <rect x="34" y="43" width="32" height="3" rx="1.5" />
          <rect x="34" y="52" width="32" height="3" rx="1.5" />
          <rect x="34" y="61" width="22" height="3" rx="1.5" />
        </g>
      </>
    )}
  </Art>
);

export const PhoneArt = () => (
  <Art look={{ top: "#6ff28a", bottom: "#13b93b", shade: "#05701f", paper: "#e6fbea" }}>
    {(id) => <Glyph Icon={IoCall} id={id} box={58} />}
  </Art>
);

// Messages: the bubble with its tail, drawn to iOS proportions (wider than tall)
export const MessagesArt = () => (
  <Art look={{ top: "#72f58c", bottom: "#0fbf35", shade: "#056e1d", paper: "#e6fbea" }}>
    {(id) => (
      <path
        fill={url(id.paper)}
        d="M50 23c18.2 0 33 11.9 33 26.6S68.2 76.2 50 76.2c-3.7 0-7.3-.5-10.6-1.4-4.4 3.2-10 5-15.6 4.6 3-2.8 4.9-6.3 5.3-10C21.8 64.4 17 57.4 17 49.6 17 34.9 31.8 23 50 23z"
      />
    )}
  </Art>
);

// Mail: an envelope with its flap drawn in blue
export const MailArt = () => (
  <Art look={{ top: "#5ccbff", bottom: "#1466f0", shade: "#073c99", paper: "#e4f0ff" }}>
    {(id) => (
      <>
        <rect x="19" y="30" width="62" height="42" rx="7.5" fill={url(id.paper)} />
        <path d="M23.5 35 50 55l26.5-20" fill="none" stroke="#5c9cf5" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
  </Art>
);

// LinkedIn: its own flat blue and white "in", as the real app icon
export const LinkedInArt = () => (
  <Art look={{ top: "#1877d6", bottom: "#0a5fb4", shade: "#03305e", paper: "#eef5ff" }}>
    {(id) => <Glyph Icon={FaLinkedinIn} id={id} box={52} />}
  </Art>
);

// Amplitude: the iconic Amplitude "A" wave on Amplitude Blue
export const AmplitudeArt = () => (
  <Art look={{ top: "#1e61f0", bottom: "#0847d1", shade: "#001e6c", paper: "#e9f1fe" }}>
    {(id) => (
      <path
        fill={url(id.paper)}
        fillRule="evenodd"
        transform="translate(9.4 10.4) scale(0.0815)"
        d="M865.81 491.08C865.81 478.29 856.8 467.63 844.66 465.2C844.59 465.19 844.52 465.17 844.44 465.15C844.3 465.13 844.16 465.08 844.02 465.06L843.53 465.01C842.24 464.8 840.93 464.67 839.59 464.65L836.1 464.32C752.69 458.35 666.88 456 586.38 454.39L586.22 453.8C547.04 306.84 498.1 156.59 432.11 156.59C370.62 156.87 315.19 255.59 267.32 450.07C233.5 449.64 202.67 449.17 173.6 448.67C171.95 448.64 170.47 448.63 169.15 448.63C162.95 448.63 159.92 448.89 158.42 449.09C142.05 451.99 130.17 466.27 130.17 483.06C130.17 500.18 142.95 514.86 159.6 517.26L159.94 517.61L251.64 517.61C243.13 556.52 235.67 595 229.44 632.07L226.71 648.39L226.68 649.17C226.74 661.76 237.03 672 249.61 672C257.59 672 264.82 667.84 268.95 661.36L269.6 661.88L314.68 517.61L531.82 517.61C548.41 580.29 565.62 645.01 588.36 705.75C600.52 738.23 628.99 814.3 676.57 814.68L677.11 814.68C750.75 814.68 779.45 695.73 798.46 616.99C802.54 600.05 806.07 585.42 809.4 574.67L810.73 570.23L810.72 570.23C811.04 569.19 811.21 568.09 811.21 566.94C811.21 560.64 806.1 555.53 799.8 555.53C794.91 555.53 790.75 558.6 789.12 562.92L789.1 562.91L787.5 567.33C781.25 584.63 775.47 600.99 770.35 615.49L769.96 616.58C738.09 706.85 723.54 748.05 695.04 748.06L694.34 748.05L693.94 748.11L693.23 748.09C656.75 748.09 622.4 599.79 609.47 543.97C607.23 534.3 605.18 525.42 603.29 517.61L839.18 517.61C843.61 517.61 847.78 516.5 851.44 514.58C851.47 514.57 851.49 514.56 851.51 514.55C851.88 514.36 852.23 514.14 852.59 513.93C852.99 513.7 853.38 513.47 853.76 513.22C853.95 513.1 854.13 512.97 854.31 512.84C854.88 512.45 855.43 512.04 855.97 511.6C856.01 511.57 856.04 511.54 856.08 511.51C862.02 506.64 865.81 499.26 865.81 491.08ZM438.95 228.64C436.19 225 433.05 223.09 429.56 223.09C426.68 223.09 424.05 224.38 422.36 225.46C395.84 246.29 359.55 334.53 329.81 450.8L356.14 451.1C408.13 451.69 461.82 452.3 514.89 453.12C500.9 399.86 487.68 354.21 475.56 317.36C457.85 263.5 445.88 239.39 438.95 228.64Z"
      />
    )}
  </Art>
);
