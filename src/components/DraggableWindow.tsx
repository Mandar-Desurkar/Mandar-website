"use client";

import { motion, useDragControls, Variants } from "framer-motion";
import TrafficLights from "./TrafficLights";
import { useWindow } from "@/context/WindowContext";
import { useEffect, useState, useRef } from "react";

export default function DraggableWindow({ 
  title, 
  children
}: { 
  title: string | React.ReactNode, 
  children: React.ReactNode
}) {
  const dragControls = useDragControls();
  const { isMinimized, activeTab } = useWindow();
  
  const [hasMounted, setHasMounted] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  
  // Custom resize state
  const [size, setSize] = useState({ width: '76vw', height: 'fit-content' });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Reset to auto-fit when changing tabs
  useEffect(() => {
    setSize({ width: '76vw', height: 'fit-content' });
  }, [activeTab]);

  const handleResizeStart = (e: React.PointerEvent, edge: 'bottom' | 'right' | 'bottom-right') => {
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

      if (edge === 'right' || edge === 'bottom-right') {
        newWidth = Math.max(400, startWidth + deltaX);
      }
      if (edge === 'bottom' || edge === 'bottom-right') {
        newHeight = Math.max(300, startHeight + deltaY);
      }

      setSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`
      });
    };

    const handlePointerUp = () => {
      setIsResizing(false);
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
      transition: hasMounted ? { duration: 0.4, type: "spring", bounce: 0.2 } : { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] } 
    },
    minimized: { 
      opacity: 0, 
      scale: 0.1, 
      y: 600,
      x: 0,
      transition: { duration: 0.5, type: "spring", bounce: 0.1 } 
    }
  };

  return (
    <motion.div 
      ref={windowRef}
      className="os-window absolute-window"
      variants={variants}
      initial="initial"
      animate={isMinimized ? "minimized" : "open"}
      drag={!isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ 
        position: 'absolute', 
        zIndex: 10,
        width: size.width,
        height: size.height,
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
      
      <div className="window-content-scroll">
        <div className="notebook-bg">
          <div className="apple-note-date">August 31, 2026 at 9:41 AM</div>
          {children}
        </div>
      </div>

      {/* Resize Handles */}
      {!isMinimized && (
        <>
          <div 
            className="resize-handle-right"
            onPointerDown={(e) => handleResizeStart(e, 'right')}
          />
          <div 
            className="resize-handle-bottom"
            onPointerDown={(e) => handleResizeStart(e, 'bottom')}
          />
          <div 
            className="resize-handle-corner"
            onPointerDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
        </>
      )}
    </motion.div>
  );
}
