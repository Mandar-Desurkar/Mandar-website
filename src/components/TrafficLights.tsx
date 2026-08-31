"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { useWindow } from "@/context/WindowContext";

export default function TrafficLights() {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { setIsMinimized } = useWindow();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRedClick = () => {
    setPopupMessage("Action Denied: You cannot close this window while a product build is in progress.");
  };

  const handleYellowClick = () => {
    setIsMinimized(true);
  };

  const handleGreenClick = () => {
    setPopupMessage("Action Denied: Window is already at optimal scale for product building.");
  };

  return (
    <>
      <div className="traffic-light-container">
        <button className="traffic-light traffic-red" onClick={handleRedClick} aria-label="Close"></button>
        <button className="traffic-light traffic-yellow" onClick={handleYellowClick} aria-label="Minimize"></button>
        <button className="traffic-light traffic-green" onClick={handleGreenClick} aria-label="Maximize"></button>
      </div>

      {mounted && popupMessage && createPortal(
        <div className="popup-overlay" onClick={() => setPopupMessage(null)}>
          <div className="popup-alert" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <AlertTriangle size={24} className="popup-icon" />
              <span>System Error</span>
            </div>
            <div className="popup-body">
              <p>{popupMessage}</p>
            </div>
            <div className="popup-actions">
              <button className="os-btn" onClick={() => setPopupMessage(null)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
