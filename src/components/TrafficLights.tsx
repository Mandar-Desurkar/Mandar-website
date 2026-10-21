"use client";

import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";

export default function TrafficLights() {
  const { activeTab, isMaximized, setIsMaximized, setIsMinimized, setIsClosed } = useWindow();

  const handleRedClick = () => {
    trackEvent("Closed Window", { section: activeTab });
    setIsClosed(true);
  };

  const handleYellowClick = () => {
    trackEvent("Minimized Window", { section: activeTab });
    setIsMinimized(true);
  };

  const handleGreenClick = () => {
    trackEvent(isMaximized ? "Restored Window" : "Maximized Window", { section: activeTab });
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="traffic-light-container">
      <button className="traffic-light traffic-red" onClick={handleRedClick} aria-label="Close"></button>
      <button className="traffic-light traffic-yellow" onClick={handleYellowClick} aria-label="Minimize"></button>
      <button className="traffic-light traffic-green" onClick={handleGreenClick} aria-label="Maximize"></button>
    </div>
  );
}
