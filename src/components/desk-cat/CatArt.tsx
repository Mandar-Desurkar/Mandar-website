// Chai, drawn as one SVG so every part can move on its own: the head lowers onto the paws to sleep and
// lifts to wake, the eyes swap between closed arcs and open eyes whose pupils follow the cursor (CSS
// vars --px / --py), the tail wraps round the paws asleep and swishes awake, and a yawn plays on waking.
// Colours are a chai latte tabby: tan coat, brown stripes, cream muzzle and paws.
import s from "./DeskCat.module.css";

const COAT = "#DDB384";
const STRIPE = "#A9764C";
const CREAM = "#F7E4C8";
const PINK = "#F3A6AE";
const INK = "#2B211B";

export default function CatArt() {
  return (
    <svg className={s.art} viewBox="0 0 140 104" aria-hidden="true">
      <ellipse cx="76" cy="97" rx="54" ry="5" fill="rgba(0,0,0,0.28)" className={s.shadow} />

      {/* Tail: wrapped round the front paws asleep, raised and swishing awake */}
      <path className={s.tailSleep} d="M114 86 C 134 92 124 101 100 100 L 62 100" fill="none" stroke={COAT} strokeWidth="9" strokeLinecap="round" />
      <g className={s.tailAwake}>
        <path d="M114 84 C 136 80 140 60 126 50" fill="none" stroke={COAT} strokeWidth="9" strokeLinecap="round" />
        <path d="M131 66 l-7 2 M134 58 l-7 1" stroke={STRIPE} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Body: a loaf, breathing while asleep */}
      <g className={s.body}>
        <ellipse cx="88" cy="76" rx="40" ry="21" fill={COAT} />
        <circle cx="113" cy="82" r="12" fill={COAT} />
        <ellipse cx="82" cy="87" rx="30" ry="8" fill={CREAM} opacity="0.75" />
        <path d="M86 56 q4 7 0 13 M100 57 q4 7 0 12 M112 62 q3 6 -1 10" fill="none" stroke={STRIPE} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Front paws */}
      <g className={s.paws}>
        <ellipse cx="50" cy="94" rx="11" ry="6" fill={CREAM} />
        <ellipse cx="67" cy="95" rx="10" ry="5.5" fill={CREAM} />
        <path d="M46 92 v3 M51 91.5 v3.5 M63 93 v3 M68 92.5 v3.5" stroke="#D8BE9C" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Head: lowered onto the paws asleep, lifted awake */}
      <g className={s.head}>
        <g className={s.ears}>
          <path d="M29 58 L32 33 L50 48 Z" fill={COAT} />
          <path d="M54 46 L69 31 L73 56 Z" fill={COAT} />
          <path d="M33 54 L34.5 39 L45 48 Z" fill={PINK} />
          <path d="M58 47 L66.5 37.5 L69 53 Z" fill={PINK} />
        </g>
        <ellipse cx="51" cy="64" rx="25" ry="21" fill={COAT} />
        <path d="M46 45 l1.2 6.5 M52 44 v7.5 M58 45.5 l-1.2 6.5" stroke={STRIPE} strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx="51" cy="73" rx="11.5" ry="8.5" fill={CREAM} />
        <circle cx="35" cy="71" r="4.2" fill={PINK} opacity="0.55" />
        <circle cx="67" cy="71" r="4.2" fill={PINK} opacity="0.55" />

        <g className={s.eyesClosed}>
          <path d="M36.5 63 q5 4.5 10 0 M55.5 63 q5 4.5 10 0" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <g className={s.eyesOpen}>
          <ellipse cx="41.5" cy="62" rx="4.8" ry="5.6" fill={INK} />
          <ellipse cx="60.5" cy="62" rx="4.8" ry="5.6" fill={INK} />
          <g className={s.pupils}>
            <circle cx="43" cy="60" r="1.7" fill="#fff" />
            <circle cx="62" cy="60" r="1.7" fill="#fff" />
            <circle cx="40.6" cy="64" r="0.8" fill="#fff" opacity="0.8" />
            <circle cx="59.6" cy="64" r="0.8" fill="#fff" opacity="0.8" />
          </g>
        </g>

        <path d="M48.3 69.5 h5.4 l-2.7 3.1 z" fill="#E07F8C" />
        <path className={s.mouth} d="M51 72.6 q-1.8 3 -4.8 1.4 M51 72.6 q1.8 3 4.8 1.4" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        <ellipse className={s.yawn} cx="51" cy="76.5" rx="3.6" ry="4.2" fill="#8A3443" />
        <path d="M29 70 l-13 -2.5 M29 73.5 l-13 1 M73 70 l13 -2.5 M73 73.5 l13 1" stroke="#8B6B50" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}
