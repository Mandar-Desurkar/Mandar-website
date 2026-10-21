"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import BootScreen from "@/components/BootScreen";
import DraggableWindow from "@/components/DraggableWindow";
import DesktopIcon from "@/components/DesktopIcon";
import MusicPlayer from "@/components/MusicPlayer";
import HiringNotification from "@/components/HiringNotification";
import MobileDock from "@/components/MobileDock";
import MobileHome from "@/components/MobileHome";
import PrototypeHost from "@/components/prototype/PrototypeHost";
import { WindowProvider, useWindow } from "@/context/WindowContext";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

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
    case 'projects': return 'Projects';
    case 'contact': return 'Contact';
    default: return 'Product Notebook';
  }
}

function DesktopEnvironment() {
  const { isClosed } = useWindow();
  
  return (
    <>
      <MusicPlayer />

      <div className="desktop-grid">
        <DesktopIcon id="about" title="About Me" dotColor="#3BA7FF" icon={<Image src="/icons/folder.webp" alt="About Me" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="experience" title="Experience" dotColor="#32D74B" icon={<Image src="/icons/folder2.webp" alt="Experience" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="education" title="Education" dotColor="#32D74B" icon={<Image src="/icons/folder3.webp" alt="Education" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="projects" title="Projects" dotColor="#FFD60A" icon={<Image src="/icons/folder4.webp" alt="Projects" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="contact" title="Contact" dotColor="#FF9F0A" icon={<Image src="/icons/folder5.webp" alt="Contact" width={56} height={56} className="drop-shadow-md" />} />
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
      </WindowProvider>
    </main>
  );
}
