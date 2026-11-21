// The portfolio sections as iOS "apps", shared by the phone home screen, Spotlight and the in-app tab
// bar so they always match. Each has drawn icon artwork (IconArt) for the home screen and Spotlight,
// and a pair of tab-bar glyphs: Ionicons 5 (modelled on SF Symbols), filled for the active tab and
// outlined for the others. Contact is a handshake (Phosphor): a paper plane on cyan read as Telegram.
import type { ComponentType } from "react";
import type { IconType } from "react-icons";
import { PiHandshake, PiHandshakeFill } from "react-icons/pi";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoJournal,
  IoJournalOutline,
  IoReader,
  IoReaderOutline,
  IoPerson,
  IoPersonOutline,
  IoSchool,
  IoSchoolOutline,
} from "react-icons/io5";
import type { SectionId } from "@/context/WindowContext";
import { AboutArt, CaseStudiesArt, ContactArt, EducationArt, ExperienceArt, NotebookArt } from "./IconArt";

export type SectionApp = {
  id: SectionId;
  label: string;
  title: string;
  Art: ComponentType;
  Glyph: IconType;
  Outline: IconType;
  // Spotlight matches on these as well as the label
  keywords: string;
};

export const SECTION_APPS: SectionApp[] = [
  { id: "about", Art: AboutArt, label: "About", title: "About", Glyph: IoPerson, Outline: IoPersonOutline, keywords: "profile intro impact installs bio" },
  { id: "experience", Art: ExperienceArt, label: "Experience", title: "Experience", Glyph: IoBriefcase, Outline: IoBriefcaseOutline, keywords: "work jobs roles career silo fortune altqube" },
  { id: "education", Art: EducationArt, label: "Education", title: "Education", Glyph: IoSchool, Outline: IoSchoolOutline, keywords: "degree college ramaiah cgpa skills toolkit swimming" },
  { id: "projects", Art: CaseStudiesArt, label: "Case Studies", title: "Case Studies", Glyph: IoReader, Outline: IoReaderOutline, keywords: "case study projects products crm rider erp freemium" },
  { id: "contact", Art: ContactArt, label: "Contact", title: "Contact", Glyph: PiHandshakeFill, Outline: PiHandshake, keywords: "email phone linkedin hire reach" },
];

// The Notebook is an app on the home screen's second page and in Spotlight, but not in the tab bar
// (five tabs is the iOS limit)
export const NOTEBOOK_APP: SectionApp = {
  id: "notebook",
  Art: NotebookArt,
  label: "Notebook",
  title: "Notebook",
  Glyph: IoJournal,
  Outline: IoJournalOutline,
  keywords: "notes principles product thinking field notes roadmap release notes now how i think",
};

export const sectionApp = (id: SectionId) => [...SECTION_APPS, NOTEBOOK_APP].find((s) => s.id === id) ?? SECTION_APPS[0];
