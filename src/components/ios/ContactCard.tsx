"use client";

// Phone Contact page, designed as an iOS Contacts card: photo and name, a row of quick actions
// (message, call, mail, LinkedIn), grouped info rows, a note, and "Add to Contacts", which hands
// the phone a vCard so a recruiter can save me in one tap.
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { Mail, MessageCircle, Phone, UserPlus } from "lucide-react";
import { profile } from "@/data/resume";
import { trackEvent } from "@/lib/analytics";
import styles from "./ContactCard.module.css";

const tel = profile.phone.replace(/\s/g, "");
const linkedinHandle = profile.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const [firstName, ...lastNames] = profile.name.split(" ");
const vcard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  `N:${lastNames.join(" ")};${firstName};;;`,
  `FN:${profile.name}`,
  `TITLE:${profile.role}`,
  `TEL;TYPE=CELL:${tel}`,
  `EMAIL;TYPE=INTERNET:${profile.email}`,
  `URL:${profile.linkedin}`,
  `ADR;TYPE=HOME:;;;${profile.location};;;`,
  "END:VCARD",
].join("\r\n");

type Method = "sms" | "phone" | "email" | "linkedin";
const track = (method: Method | "vcard") => trackEvent("Clicked Contact Method", { method, placement: "contact_window" });

const ACTIONS: { method: Method; label: string; href: string; Icon: React.ComponentType<{ size?: number }>; external?: boolean }[] = [
  { method: "sms", label: "message", href: `sms:${tel}`, Icon: MessageCircle },
  { method: "phone", label: "call", href: `tel:${tel}`, Icon: Phone },
  { method: "email", label: "mail", href: `mailto:${profile.email}`, Icon: Mail },
  { method: "linkedin", label: "LinkedIn", href: profile.linkedin, Icon: FaLinkedin, external: true },
];

const newTab = { target: "_blank", rel: "noopener noreferrer" };

export default function ContactCard() {
  return (
    <section className={styles.card} aria-label="Contact card">
      <header className={styles.head}>
        <Image src="/profile-new.jpg" alt="" width={104} height={104} className={styles.avatar} priority />
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.role}>{profile.role}</p>
      </header>

      <div className={styles.actions}>
        {ACTIONS.map(({ method, label, href, Icon, external }) => (
          <a key={method} href={href} className={styles.action} onClick={() => track(method)} {...(external ? newTab : {})}>
            <Icon size={22} />
            <span>{label}</span>
          </a>
        ))}
      </div>

      <div className={styles.group}>
        <a href={`tel:${tel}`} className={styles.row} onClick={() => track("phone")}>
          <span className={styles.rowLabel}>mobile</span>
          <span className={styles.rowValue}>{profile.phone}</span>
        </a>
        <a href={`mailto:${profile.email}`} className={styles.row} onClick={() => track("email")}>
          <span className={styles.rowLabel}>email</span>
          <span className={styles.rowValue}>{profile.email}</span>
        </a>
        <a href={profile.linkedin} className={styles.row} onClick={() => track("linkedin")} {...newTab}>
          <span className={styles.rowLabel}>LinkedIn</span>
          <span className={styles.rowValue}>{linkedinHandle}</span>
        </a>
        <div className={styles.row}>
          <span className={styles.rowLabel}>location</span>
          <span className={`${styles.rowValue} ${styles.plain}`}>{profile.location}</span>
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Notes</span>
          <span className={`${styles.rowValue} ${styles.note}`}>
            Looking to launch a new product, scale an existing one, or just chat about strategy? Drop me a line!
          </span>
        </div>
      </div>

      <div className={styles.group}>
        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`}
          download={`${profile.name.replace(/\s+/g, "-")}.vcf`}
          className={`${styles.row} ${styles.button}`}
          onClick={() => track("vcard")}
        >
          <UserPlus size={20} aria-hidden="true" />
          Add to Contacts
        </a>
      </div>
    </section>
  );
}
