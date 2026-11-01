"use client";

import styles from "./Contact.module.css";
import { useState } from "react";
import { Check, Copy, Mail, Phone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";
import { useIsMobile } from "@/hooks/useIsMobile";
import ContactCard from "./ios/ContactCard";

export default function Contact() {
  // Phones get an iOS Contacts card instead of the notebook doodle
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  if (isMobile) return <ContactCard />;

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        
        <div className={styles.doodleBox}>
          <div className={styles.headerBox}>
            <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
              Let&apos;s Connect
            </h2>
          </div>
          
          <p className={styles.description}>
            Looking to launch a new product, scale an existing one, or just chat about strategy? Drop me a line!
          </p>
          
          <div className={styles.details}>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Email:</strong> mandardesurkar3@gmail.com{" "}
              <button
                type="button"
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard?.writeText("mandardesurkar3@gmail.com").then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1800);
                  });
                  trackEvent("Clicked Contact Method", { method: "copy_email", placement: "contact_window" });
                }}
                aria-label="Copy email address"
              >
                {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </p>
            <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> +91 8073118693</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Location:</strong> Bangalore, India</p>
          </div>
          
          <div className={styles.socials}>
            <a href="mailto:mandardesurkar3@gmail.com" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "email", placement: "contact_window" })}>
              <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Email
            </a>
            <a href="https://www.linkedin.com/in/mandar-desurkar/" target="_blank" rel="noopener noreferrer" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "contact_window" })}>
              <FaLinkedin size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> LinkedIn
            </a>
            <a href="tel:+918073118693" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "phone", placement: "contact_window" })}>
              <Phone size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Call
            </a>
          </div>
        </div>
        
      </div>

      <div className={styles.footer}>
        <p>SYSTEM HALTED. End of file.</p>
      </div>
    </section>
  );
}
