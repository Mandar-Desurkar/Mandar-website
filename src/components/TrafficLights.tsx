"use client";

import { useWindow } from "@/context/WindowContext";

export default function TrafficLights() {
  const { isMaximized, setIsMaximized, setIsMinimized, setIsClosed } = useWindow();

  const handleRedClick = () => {
    setIsClosed(true);
  };

  const handleYellowClick = () => {
    setIsMinimized(true);
  };

  const handleGreenClick = () => {
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
