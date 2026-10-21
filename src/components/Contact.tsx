"use client";

import styles from "./Contact.module.css";
import { Mail, Phone } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { trackEvent } from "@/lib/analytics";

export default function Contact() {
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
          
          <div style={{ margin: '1.5rem 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '1rem' }}>
            <p style={{ margin: '0.5rem 0' }}><strong>Email:</strong> mandardesurkar3@gmail.com</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> +91 8073118693</p>
            <p style={{ margin: '0.5rem 0' }}><strong>Location:</strong> Bangalore, India</p>
          </div>
          
          <div className={styles.socials}>
            <a href="mailto:mandardesurkar3@gmail.com" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "email", placement: "contact_window" })}>
              <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> EMAIL
            </a>
            <a href="https://www.linkedin.com/in/mandar-desurkar/" target="_blank" rel="noopener noreferrer" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "linkedin", placement: "contact_window" })}>
              <FaLinkedin size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> LINKEDIN
            </a>
            <a href="tel:+918073118693" className="os-btn" onClick={() => trackEvent("Clicked Contact Method", { method: "phone", placement: "contact_window" })}>
              <Phone size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> CALL
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
