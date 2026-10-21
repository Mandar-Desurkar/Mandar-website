// The portfolio sections as iOS "apps": one glyph and colour each, shared by the phone home screen
// and the in-app tab bar so the two always match.
import { BookUser, BriefcaseBusiness, GraduationCap, Layers, UserRound, type LucideIcon } from "lucide-react";
import type { SectionId } from "@/context/WindowContext";

export type SectionApp = { id: SectionId; label: string; title: string; Glyph: LucideIcon; colors: [string, string] };

export const SECTION_APPS: SectionApp[] = [
  { id: "about", label: "About", title: "About", Glyph: UserRound, colors: ["#5AC8FA", "#0A84FF"] },
  { id: "experience", label: "Experience", title: "Experience", Glyph: BriefcaseBusiness, colors: ["#FFB340", "#FF8A00"] },
  { id: "education", label: "Education", title: "Education", Glyph: GraduationCap, colors: ["#7D7AFF", "#4B48D6"] },
  { id: "projects", label: "Projects", title: "Projects", Glyph: Layers, colors: ["#4CD964", "#28A745"] },
  { id: "contact", label: "Contact", title: "Contact", Glyph: BookUser, colors: ["#A2A2A7", "#6E6E73"] },
];

export const sectionApp = (id: SectionId) => SECTION_APPS.find((s) => s.id === id) ?? SECTION_APPS[0];
