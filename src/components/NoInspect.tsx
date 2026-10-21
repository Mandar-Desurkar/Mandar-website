"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function NoInspect() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      trackEvent("Hit Content Protection", { action: "context_menu" });
    };

    // Disable common DevTools and View Source keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === "F12") {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "devtools_shortcut" });
      }
      
      // Prevent Ctrl+Shift+I / Cmd+Option+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "devtools_shortcut" });
      }

      // Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "devtools_shortcut" });
      }

      // Prevent Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.altKey === false) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "view_source_shortcut" });
      }
      
      // Prevent Ctrl+Shift+C / Cmd+Option+C (Element Inspector)
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey || e.altKey) && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "devtools_shortcut" });
      }

      // Prevent macOS Screenshots (Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "screenshot_shortcut" });
        alert("Screenshots are disabled on this portfolio.");
      }

      // Prevent Windows Snipping Tool (Win+Shift+S)
      if (e.metaKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "screenshot_shortcut" });
        alert("Screenshots are disabled on this portfolio.");
      }

      // Prevent specific third-party screenshot tool (Cmd + Up Arrow)
      if (e.metaKey && e.key === "ArrowUp") {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "screenshot_shortcut" });
        alert("Screenshots are disabled on this portfolio.");
      }

      // Prevent Print Screen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        trackEvent("Hit Content Protection", { action: "screenshot_shortcut" });
        navigator.clipboard.writeText(''); // Attempt to clear clipboard
        alert("Screenshots are disabled on this portfolio.");
      }
    };

    // Prevent Copying text
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      trackEvent("Hit Content Protection", { action: "copy" });
      alert("Copying text is disabled on this portfolio.");
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  return null;
}
