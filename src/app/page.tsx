import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import BootScreen from "@/components/BootScreen";
import Dock from "@/components/Dock";
import DraggableWindow from "@/components/DraggableWindow";

export default function Home() {
  return (
    <main>
      <BootScreen />
      <Navbar />
      
      <DraggableWindow>
        <Hero />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </DraggableWindow>
      
      <Dock />
    </main>
  );
}
