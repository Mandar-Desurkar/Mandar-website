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
import { WindowProvider } from "@/context/WindowContext";
import { User, Briefcase, GraduationCap, FolderGit2, Mail } from "lucide-react";

export default function Home() {
  return (
    <main>
      <BootScreen />
      <Navbar />
      
      <WindowProvider>
        <div className="desktop-grid">
          <DesktopIcon id="about" title="About Me" icon={<User size={36} color="#ffffff" strokeWidth={1.5} />} />
          <DesktopIcon id="experience" title="Experience" icon={<Briefcase size={36} color="#ffffff" strokeWidth={1.5} />} />
          <DesktopIcon id="education" title="Education" icon={<GraduationCap size={36} color="#ffffff" strokeWidth={1.5} />} />
          <DesktopIcon id="projects" title="Projects" icon={<FolderGit2 size={36} color="#ffffff" strokeWidth={1.5} />} />
          <DesktopIcon id="contact" title="Contact" icon={<Mail size={36} color="#ffffff" strokeWidth={1.5} />} />
        </div>

        <DraggableWindow windowId="about" title="About Me" defaultPos={{x: 20, y: 30}}>
          <Hero />
        </DraggableWindow>
        <DraggableWindow windowId="experience" title="Experience" defaultPos={{x: 50, y: 60}}>
          <Experience />
        </DraggableWindow>
        <DraggableWindow windowId="education" title="Education" defaultPos={{x: 80, y: 90}}>
          <Education />
        </DraggableWindow>
        <DraggableWindow windowId="projects" title="Projects" defaultPos={{x: 110, y: 120}}>
          <Projects />
        </DraggableWindow>
        <DraggableWindow windowId="contact" title="Contact" defaultPos={{x: 140, y: 150}}>
          <Contact />
        </DraggableWindow>
        
        <Dock />
      </WindowProvider>
    </main>
  );
}
