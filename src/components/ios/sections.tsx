// The portfolio sections as iOS "apps": one glyph and colour each, shared by the phone home screen,
// Spotlight and the in-app tab bar so they always match. Glyphs are Ionicons 5 (modelled on SF
// Symbols): the filled one sits on the app icon and the active tab, the outline one on inactive tabs.
// Contact is a handshake (Phosphor): a paper plane on cyan read as Telegram's icon.
import type { IconType } from "react-icons";
import { PiHandshake, PiHandshakeFill } from "react-icons/pi";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoLayers,
  IoLayersOutline,
  IoPerson,
  IoPersonOutline,
  IoSchool,
  IoSchoolOutline,
} from "react-icons/io5";
import type { SectionId } from "@/context/WindowContext";

export type SectionApp = {
  id: SectionId;
  label: string;
  title: string;
  Glyph: IconType;
  Outline: IconType;
  colors: [string, string];
  // Spotlight matches on these as well as the label
  keywords: string;
  // Optical size correction for glyphs that read lighter than the rest at the same box size
  glyphScale?: number;
};

// Glyph size inside an app tile, as on iOS (about half the tile), with the per-app correction
export const glyphSize = (app: SectionApp) => `${Math.round(54 * (app.glyphScale ?? 1))}%`;

export const SECTION_APPS: SectionApp[] = [
  { id: "about", label: "About", title: "About", Glyph: IoPerson, Outline: IoPersonOutline, colors: ["#5AC8FA", "#0A7AFF"], keywords: "profile intro impact installs bio", glyphScale: 1.06 },
  { id: "experience", label: "Experience", title: "Experience", Glyph: IoBriefcase, Outline: IoBriefcaseOutline, colors: ["#FFC24A", "#FF8A00"], keywords: "work jobs roles career silo fortune altqube" },
  { id: "education", label: "Education", title: "Education", Glyph: IoSchool, Outline: IoSchoolOutline, colors: ["#8E8BFF", "#5145E5"], keywords: "degree college ramaiah cgpa skills toolkit swimming" },
  { id: "projects", label: "Projects", title: "Projects", Glyph: IoLayers, Outline: IoLayersOutline, colors: ["#5EE07A", "#1DB447"], keywords: "products case studies crm rider erp freemium" },
  { id: "contact", label: "Contact", title: "Contact", Glyph: PiHandshakeFill, Outline: PiHandshake, colors: ["#4FE0CF", "#0E9F9F"], keywords: "email phone linkedin hire reach", glyphScale: 1.18 },
];

export const sectionApp = (id: SectionId) => SECTION_APPS.find((s) => s.id === id) ?? SECTION_APPS[0];
