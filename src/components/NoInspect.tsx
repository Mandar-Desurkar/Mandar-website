"use client";

import { useEffect } from "react";

export default function NoInspect() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common DevTools and View Source keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
      }

      // Prevent Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.altKey === false) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
      }
      
      // Prevent Ctrl+Shift+C / Cmd+Option+C (Element Inspector)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
