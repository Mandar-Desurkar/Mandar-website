"use client";

import styles from "./Contact.module.css";
import { Mail } from "lucide-react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection}>
      <div className={`container ${styles.container}`}>
        
        <div className={styles.doodleBox}>
          <div className={styles.headerBox}>
            <h2 className="hand-heading-2" style={{ marginBottom: 0 }}>
              Let's Connect
            </h2>
          </div>
          
          <p className={styles.description}>
            Looking to launch a new product, scale an existing one, or just chat about strategy? Drop me a line!
          </p>
          
          <div className={styles.socials}>
            <a href="mailto:hello@example.com" className="os-btn">
              <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> MAILTO:
            </a>
            <a href="#" className="os-btn">
              <FaLinkedin size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> LINKEDIN
            </a>
            <a href="#" className="os-btn">
              <FaTwitter size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> TWITTER
            </a>
          </div>
          
          <div className={styles.footer}>
            <p>SYSTEM HALTED. End of file.</p>
          </div>
        </div>
        
      </div>
    </section>
  );
}
