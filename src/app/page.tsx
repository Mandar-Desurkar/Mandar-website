"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BootScreen from "@/components/BootScreen";
import DraggableWindow from "@/components/DraggableWindow";
import DesktopIcon from "@/components/DesktopIcon";
import iconStyles from "@/components/DesktopIcon.module.css";
import { shippedApps } from "@/data/resume";
import HiringNotification from "@/components/HiringNotification";
import MobileDock from "@/components/MobileDock";
import MobileHome from "@/components/MobileHome";
import PhoneBack from "@/components/PhoneBack";
import PrototypeHost from "@/components/prototype/PrototypeHost";
import { WindowProvider, useWindow } from "@/context/WindowContext";
import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

// Each section's code loads when it is opened, so a phone landing on the home screen doesn't pay for them
const Experience = dynamic(() => import("@/components/Experience"));
const Education = dynamic(() => import("@/components/Education"));
const Projects = dynamic(() => import("@/components/Projects"));
const Contact = dynamic(() => import("@/components/Contact"));

function ActiveSection() {
  const { activeTab } = useWindow();

  switch (activeTab) {
    case 'about': return <Hero />;
    case 'experience': return <Experience />;
    case 'education': return <Education />;
    case 'projects': return <Projects />;
    case 'contact': return <Contact />;
    default: return <Hero />;
  }
}

function WindowTitle() {
  const { activeTab } = useWindow();
  switch (activeTab) {
    case 'about': return 'About Me';
    case 'experience': return 'Experience';
    case 'education': return 'Education';
    case 'projects': return 'Case Studies';
    case 'contact': return 'Contact';
    default: return 'Product Notebook';
  }
}

function DesktopEnvironment() {
  const { isClosed, openPrototype } = useWindow();
  
  return (
    <>
      <div className="desktop-grid">
        <DesktopIcon id="about" title="About Me" thumb="/profile-photo.jpg" />
        <DesktopIcon id="experience" title="Experience" icon={<Image src="/icons/folder2.webp" alt="" width={56} height={56} />} />
        <DesktopIcon id="education" title="Education" icon={<Image src="/icons/folder3.webp" alt="" width={56} height={56} />} />
        <DesktopIcon id="projects" title="Case Studies" icon={<Image src="/icons/folder4.webp" alt="" width={56} height={56} />} />
        <DesktopIcon id="contact" title="Contact" icon={<Image src="/icons/folder5.webp" alt="" width={56} height={56} />} />
        {shippedApps.map(
          (app) =>
            app.prototype && (
              <DesktopIcon
                key={app.name}
                title={app.name}
                icon={<Image src={app.icon} alt="" width={116} height={116} className={iconStyles.appIcon} />}
                onOpen={() => app.prototype && openPrototype(app.prototype, "desktop")}
              />
            ),
        )}
      </div>

      <MobileHome />
      <MobileDock />

      <AnimatePresence>
        {!isClosed && (
          <DraggableWindow key="main-window" title={<WindowTitle />}>
            <ActiveSection />
          </DraggableWindow>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <main>
      <BootScreen />
      
      <WindowProvider>
        <Navbar />
        <DesktopEnvironment />
        <HiringNotification />
        <PrototypeHost />
        <PhoneBack />
      </WindowProvider>
    </main>
  );
}
