"use client";

import { motion, useDragControls, Variants } from "framer-motion";
import TrafficLights from "./TrafficLights";
import { useWindow } from "@/context/WindowContext";
import { useEffect, useState } from "react";

export default function DraggableWindow({ 
  windowId, 
  title, 
  children,
  defaultPos = { x: 0, y: 0 }
}: { 
  windowId: string, 
  title: string, 
  children: React.ReactNode,
  defaultPos?: { x: number, y: number }
}) {
  const dragControls = useDragControls();
  const { windows, focusWindow } = useWindow();
  
  const windowState = windows[windowId];
  const isMinimized = windowState?.isMinimized || false;
  const zIndex = windowState?.zIndex || 10;
  const isOpen = windowState?.isOpen || false;
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const variants: Variants = {
    initial: { opacity: 0, scale: 0.95, y: defaultPos.y + 40, x: defaultPos.x },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: defaultPos.y, 
      x: defaultPos.x,
      transition: hasMounted ? { duration: 0.4, type: "spring", bounce: 0.2 } : { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] } 
    },
    minimized: { 
      opacity: 0, 
      scale: 0.1, 
      y: 600,
      x: defaultPos.x,
      transition: { duration: 0.5, type: "spring", bounce: 0.1 } 
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="os-window absolute-window"
      variants={variants}
      initial="initial"
      animate={isMinimized ? "minimized" : "open"}
      drag={!isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onPointerDown={() => focusWindow(windowId)}
      style={{ position: 'absolute', zIndex }}
    >
      <div 
        className="os-titlebar" 
        onPointerDown={(e) => {
          focusWindow(windowId);
          dragControls.start(e);
        }}
        style={{ cursor: "grab", touchAction: "none" }}
        title="Drag to move"
      >
        <TrafficLights windowId={windowId} />
        <span>{title}</span>
      </div>
      
      <div className="notebook-bg">
        {children}
      </div>
    </motion.div>
  );
}
