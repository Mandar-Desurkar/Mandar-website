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
import { User, Briefcase, GraduationCap, FolderGit2, Mail } from "lucide-react";

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
  const { activeTab } = useWindow();
  
  return (
    <>
      <div className="desktop-grid">
        <DesktopIcon id="about" title="About Me" icon={<User size={36} color="#ffffff" strokeWidth={1.5} />} />
        <DesktopIcon id="experience" title="Experience" icon={<Briefcase size={36} color="#ffffff" strokeWidth={1.5} />} />
        <DesktopIcon id="education" title="Education" icon={<GraduationCap size={36} color="#ffffff" strokeWidth={1.5} />} />
        <DesktopIcon id="projects" title="Projects" icon={<FolderGit2 size={36} color="#ffffff" strokeWidth={1.5} />} />
        <DesktopIcon id="contact" title="Contact" icon={<Mail size={36} color="#ffffff" strokeWidth={1.5} />} />
      </div>

      <DraggableWindow title={<WindowTitle />}>
        <ActiveSection />
      </DraggableWindow>
      
      <Dock />
    </>
  );
}

export default function Home() {
  return (
    <main>
      <BootScreen />
      <Navbar />
      
      <WindowProvider>
        <DesktopEnvironment />
      </WindowProvider>
    </main>
  );
}
