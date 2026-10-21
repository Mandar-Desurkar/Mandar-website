"use client";

import { motion, useDragControls, Variants } from "framer-motion";
import TrafficLights from "./TrafficLights";
import { useWindow } from "@/context/WindowContext";
import { trackEvent } from "@/lib/analytics";
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SECTION_SCROLL_TOP } from "./MobileDock";
import { ChevronLeft, Share } from "lucide-react";
import { profile } from "@/data/resume";
import { sectionApp } from "./ios/sections";

export default function DraggableWindow({ 
  title, 
  children
}: { 
  title: string | React.ReactNode, 
  children: React.ReactNode
}) {
  const dragControls = useDragControls();
  const { isMinimized, isMaximized, activeTab, setIsClosed } = useWindow();
  const [toast, setToast] = useState<string | null>(null);
  // Phone: the large title has scrolled under the nav bar, so the inline title and hairline show
  const [scrolled, setScrolled] = useState(false);

  // Phone nav bar: Share opens the native share sheet (WhatsApp, LinkedIn…), else copies the link
  const shareProfile = async () => {
    const url = window.location.origin;
    const data = { title: `${profile.name} · ${profile.role}`, text: `${profile.name}, ${profile.role}: portfolio and interactive app prototypes`, url };
    if (navigator.share) {
      try {
        await navigator.share(data);
        trackEvent("Shared Profile", { method: "native", section: activeTab });
      } catch {
        // dismissed: nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      trackEvent("Shared Profile", { method: "copy", section: activeTab });
      setToast("Link copied");
      setTimeout(() => setToast(null), 1800);
    } catch {}
  };
  
  const [hasMounted, setHasMounted] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Phones get a full-width sheet between the menu bar and the dock: no drag, no resize
  const isMobile = useIsMobile();
  
  // Custom resize state
  const [size, setSize] = useState({ width: '60vw', height: '70vh' });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Re-tapping the open section in the mobile dock scrolls it back to the top
  useEffect(() => {
    const toTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.addEventListener(SECTION_SCROLL_TOP, toTop);
    return () => window.removeEventListener(SECTION_SCROLL_TOP, toTop);
  }, []);

  // Change window size dynamically based on the active tab
  useEffect(() => {
    let newWidth = '60vw';
    let newHeight = '70vh';

    switch (activeTab) {
      case 'about':
        newWidth = '65vw'; // wide enough for "I'm a product builder." on one line
        newHeight = '64vh'; // hugs hero, KPIs and CTAs with no empty space below
        break;
      case 'experience':
        newWidth = '70vw';
        newHeight = '80vh';
        break;
      case 'education':
        newWidth = '65vw';
        newHeight = '65vh';
        break;
      case 'projects':
        newWidth = '75vw';
        newHeight = '80vh';
        break;
      case 'contact':
        newWidth = '55vw';
        newHeight = '68vh'; // fits the card and footer without clipping
        break;
      default:
        newWidth = '60vw';
        newHeight = '70vh';
    }

    setSize({ width: newWidth, height: newHeight });
    // A new section starts at its top, not wherever the previous one was scrolled to
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const handleResizeStart = (e: React.PointerEvent, edge: 'bottom' | 'right' | 'bottom-right' | 'left' | 'bottom-left' | 'top' | 'top-left' | 'top-right') => {
    e.preventDefault();
    e.stopPropagation(); // prevent drag from taking over
    setIsResizing(true);
    
    if (!windowRef.current) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = windowRef.current.getBoundingClientRect().width;
    const startHeight = windowRef.current.getBoundingClientRect().height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (edge.includes('right')) {
        newWidth = Math.max(400, startWidth + deltaX);
      } else if (edge.includes('left')) {
        newWidth = Math.max(400, startWidth - deltaX);
      }
      
      if (edge.includes('bottom')) {
        newHeight = Math.max(300, startHeight + deltaY);
      } else if (edge.includes('top')) {
        newHeight = Math.max(300, startHeight - deltaY);
      }

      setSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`
      });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect && (Math.round(rect.width) !== Math.round(startWidth) || Math.round(rect.height) !== Math.round(startHeight))) {
        trackEvent("Resized Window", { section: activeTab, width: Math.round(rect.width), height: Math.round(rect.height) });
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const variants: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 40, x: 0 },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      x: 0,
      width: size.width,
      height: size.height,
      borderRadius: 12,
      transition: hasMounted ? { duration: 0.4, type: "spring", bounce: 0.2 } : { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] } 
    },
    maximized: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      width: '100vw',
      height: '100vh',
      maxWidth: 'none',
      borderRadius: 0,
      transition: { duration: 0.4, type: "spring", bounce: 0.1 }
    },
    minimized: { 
      opacity: 0, 
      scale: 0.1, 
      y: 600,
      x: 0,
      transition: { duration: 0.5, type: "spring", bounce: 0.1 } 
    },
    closed: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Opening a section zooms it up like an iOS app launch; going Home shrinks it back
  const mobileVariants: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    open: { opacity: 1, scale: 1, transition: { duration: 0.34, ease: [0.2, 0.9, 0.3, 1] } },
    minimized: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    closed: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  if (isMobile) {
    const app = sectionApp(activeTab);
    // About and Contact are profile-style pages with their own header (photo + name); the others are
    // grouped-list pages that start with an iOS large title
    const grouped = activeTab !== "about";
    const largeTitle = grouped && activeTab !== "contact";
    return (
      <motion.div
        className={`os-window mobile-window ios-app ${grouped ? "ios-grouped" : ""}`}
        variants={mobileVariants}
        initial="initial"
        animate={isMinimized ? "minimized" : "open"}
        exit="closed"
        style={{ position: "fixed", zIndex: 10 }}
      >
        {/* iOS nav bar: round glass Back (to the home screen) and Share buttons, inline title once the
            large title scrolls away */}
        <header className={`ios-navbar ${scrolled ? "is-scrolled" : ""}`}>
          <button
            type="button"
            className="ios-nav-back"
            aria-label="Home screen"
            onClick={() => {
              trackEvent("Closed Window", { section: activeTab });
              setIsClosed(true);
            }}
          >
            <ChevronLeft size={21} strokeWidth={2.5} aria-hidden="true" />
          </button>
          <span className="ios-nav-title" aria-hidden={!scrolled}>
            {app.title}
          </span>
          <button type="button" className="ios-nav-btn" aria-label="Share this portfolio" onClick={shareProfile}>
            <Share size={17} strokeWidth={2.3} aria-hidden="true" />
          </button>
        </header>
        <div
          className="window-content-scroll"
          ref={scrollRef}
          onScroll={(e) => {
            const past = e.currentTarget.scrollTop > (largeTitle ? 34 : 120);
            if (past !== scrolled) setScrolled(past);
          }}
        >
          {largeTitle && <h1 className="ios-large-title">{app.title}</h1>}
          <div className="notebook-bg">{children}</div>
        </div>
        {toast && (
          <span className="mobile-toast" role="status">
            {toast}
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={windowRef}
      className={`os-window ${isMaximized ? 'maximized-window' : 'absolute-window'}`}
      variants={variants}
      initial="initial"
      animate={isMinimized ? "minimized" : isMaximized ? "maximized" : "open"}
      exit="closed"
      drag={!isMinimized && !isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={() => trackEvent("Moved Window", { section: activeTab })}
      style={{ 
        position: 'absolute', 
        zIndex: isMaximized ? 9999 : 10,
        margin: isMaximized ? 0 : undefined,
        top: isMaximized ? 0 : undefined,
        left: isMaximized ? 0 : undefined,
        maxWidth: isMaximized ? 'none' : undefined,
        // When not maximizing or opening (e.g. initial), width/height are handled by variants
        // but we keep size in state. Framer motion overrides these with variant values
      }}
    >
      <div 
        className="os-titlebar" 
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
        style={{ cursor: "grab", touchAction: "none" }}
        title="Drag to move"
      >
        <TrafficLights />
        <span>{title}</span>
      </div>
      
      <div className="window-content-scroll" ref={scrollRef}>
        <div className="notebook-bg">
          <div className="apple-note-date">August 31, 2026 at 9:41 AM</div>
          {children}
        </div>
      </div>

      {/* Resize Handles */}
      {!isMinimized && !isMaximized && (
        <>
          <div 
            className="resize-handle-right"
            onPointerDown={(e) => handleResizeStart(e, 'right')}
          />
          <div 
            className="resize-handle-left"
            onPointerDown={(e) => handleResizeStart(e, 'left')}
          />
          <div 
            className="resize-handle-bottom"
            onPointerDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div 
            className="resize-handle-top"
            onPointerDown={(e) => handleResizeStart(e, 'top')}
          />
          
          <div 
            className="resize-handle-corner-br"
            onPointerDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
          <div 
            className="resize-handle-corner-bl"
            onPointerDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div 
            className="resize-handle-corner-tr"
            onPointerDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div 
            className="resize-handle-corner-tl"
            onPointerDown={(e) => handleResizeStart(e, 'top-left')}
          />
        </>
      )}
    </motion.div>
  );
}
