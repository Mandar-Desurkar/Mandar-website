"use client";

import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";

export default function TrafficLights() {
  const { activeTab, isMaximized, setIsMaximized, setIsMinimized, setIsClosed } = useWindow();

  const handleRedClick = () => {
    trackEvent("Closed Window", { section: activeTab, method: "button" });
    setIsClosed(true);
  };

  const handleYellowClick = () => {
    trackEvent("Minimized Window", { section: activeTab });
    setIsMinimized(true);
  };

  const handleGreenClick = () => {
    trackEvent(isMaximized ? "Restored Window" : "Maximized Window", { section: activeTab, method: "button" });
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="traffic-light-container">
      <button className="traffic-light traffic-red" onClick={handleRedClick} aria-label="Close (Esc)" title="Close (Esc)"></button>
      <button className="traffic-light traffic-yellow" onClick={handleYellowClick} aria-label="Minimize" title="Minimize"></button>
      <button className="traffic-light traffic-green" onClick={handleGreenClick} aria-label={isMaximized ? "Restore size" : "Maximize"} title={isMaximized ? "Restore size" : "Maximize"}></button>
    </div>
  );
}
