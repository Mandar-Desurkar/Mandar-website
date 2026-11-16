// Ways to reach me as iOS apps (Phone, Messages, Mail, LinkedIn), shared by the home-screen dock and
// Spotlight so both use the same links, icon artwork and analytics method names.
import type { ComponentType } from "react";
import { profile } from "@/data/resume";
import { LinkedInArt, MailArt, MessagesArt, PhoneArt } from "./IconArt";

export type ContactApp = {
  method: "phone" | "sms" | "email" | "linkedin";
  title: string;
  subtitle: string;
  ariaLabel: string;
  href: string;
  external?: boolean;
  Art: ComponentType;
};

const tel = profile.phone.replace(/\s/g, "");

export const CONTACT_APPS: ContactApp[] = [
  { method: "phone", title: "Call", subtitle: profile.phone, ariaLabel: `Call ${profile.name}`, href: `tel:${tel}`, Art: PhoneArt },
  { method: "sms", title: "Message", subtitle: profile.phone, ariaLabel: `Message ${profile.name}`, href: `sms:${tel}`, Art: MessagesArt },
  { method: "email", title: "Email", subtitle: profile.email, ariaLabel: `Email ${profile.name}`, href: `mailto:${profile.email}`, Art: MailArt },
  {
    method: "linkedin",
    title: "LinkedIn",
    subtitle: profile.linkedin.replace(/^https:\/\/(www\.)?|\/$/g, ""),
    ariaLabel: `${profile.name} on LinkedIn`,
    href: profile.linkedin,
    external: true,
    Art: LinkedInArt,
  },
];
