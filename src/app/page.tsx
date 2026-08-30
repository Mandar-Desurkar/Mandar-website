import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import BootScreen from "@/components/BootScreen";
import TrafficLights from "@/components/TrafficLights";
import Dock from "@/components/Dock";

export default function Home() {
  return (
    <main>
      <BootScreen />
      <Navbar />
      
      <div className="os-window">
        <div className="os-titlebar">
          <TrafficLights />
          <span>Product Notebook</span>
        </div>
        
        <div className="notebook-bg">
          <Hero />
          <Experience />
          <Education />
          <Projects />
          <Contact />
        </div>
      </div>
      
      <Dock />
    </main>
  );
}
