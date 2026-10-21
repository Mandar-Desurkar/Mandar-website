// Ways to reach me as iOS apps (Phone, Messages, Mail, LinkedIn), shared by the home-screen dock and
// Spotlight so both use the same links, glyphs and analytics method names.
import type { IconType } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa";
import { IoCall, IoChatbubble, IoMail } from "react-icons/io5";
import { profile } from "@/data/resume";

export type ContactApp = {
  method: "phone" | "sms" | "email" | "linkedin";
  title: string;
  subtitle: string;
  ariaLabel: string;
  href: string;
  external?: boolean;
  Glyph: IconType;
  colors: [string, string];
};

const tel = profile.phone.replace(/\s/g, "");

export const CONTACT_APPS: ContactApp[] = [
  { method: "phone", title: "Call", subtitle: profile.phone, ariaLabel: `Call ${profile.name}`, href: `tel:${tel}`, Glyph: IoCall, colors: ["#6BE77F", "#25B946"] },
  { method: "sms", title: "Message", subtitle: profile.phone, ariaLabel: `Message ${profile.name}`, href: `sms:${tel}`, Glyph: IoChatbubble, colors: ["#6EF285", "#11C333"] },
  { method: "email", title: "Email", subtitle: profile.email, ariaLabel: `Email ${profile.name}`, href: `mailto:${profile.email}`, Glyph: IoMail, colors: ["#52C2FF", "#1467F2"] },
  {
    method: "linkedin",
    title: "LinkedIn",
    subtitle: profile.linkedin.replace(/^https:\/\/(www\.)?|\/$/g, ""),
    ariaLabel: `${profile.name} on LinkedIn`,
    href: profile.linkedin,
    external: true,
    Glyph: FaLinkedinIn,
    colors: ["#2F8EE8", "#0A66C2"],
  },
];
