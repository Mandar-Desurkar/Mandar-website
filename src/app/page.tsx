"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import BootScreen from "@/components/BootScreen";
import Dock from "@/components/Dock";
import DraggableWindow from "@/components/DraggableWindow";
import DesktopIcon from "@/components/DesktopIcon";
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
  const { activeTab, isClosed } = useWindow();
  
  return (
    <>
      <div className="desktop-grid">
        <DesktopIcon id="about" title="About Me" dotColor="#3BA7FF" icon={<Image src="/icons/Folder.svg" alt="About Me" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="experience" title="Experience" dotColor="#32D74B" icon={<Image src="/icons/Folder2.svg" alt="Experience" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="education" title="Education" dotColor="#32D74B" icon={<Image src="/icons/Folder3.svg" alt="Education" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="projects" title="Projects" dotColor="#FFD60A" icon={<Image src="/icons/Folder4.svg" alt="Projects" width={56} height={56} className="drop-shadow-md" />} />
        <DesktopIcon id="contact" title="Contact" dotColor="#FF9F0A" icon={<Image src="/icons/Folder5.svg" alt="Contact" width={56} height={56} className="drop-shadow-md" />} />
      </div>

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
      </WindowProvider>
    </main>
  );
}
