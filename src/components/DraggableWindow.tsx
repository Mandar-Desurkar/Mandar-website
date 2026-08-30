"use client";

import { motion, useDragControls } from "framer-motion";
import TrafficLights from "./TrafficLights";
import { useWindow } from "@/context/WindowContext";
import { useEffect, useState } from "react";

export default function DraggableWindow({ children }: { children: React.ReactNode }) {
  const dragControls = useDragControls();
  const { isMinimized } = useWindow();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const variants = {
    initial: { opacity: 0, scale: 0.95, y: 40 },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: hasMounted ? { duration: 0.4, type: "spring", bounce: 0.2 } : { duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] } 
    },
    minimized: { 
      opacity: 0, 
      scale: 0.1, 
      y: 600, 
      transition: { duration: 0.5, type: "spring", bounce: 0.1 } 
    }
  };

  return (
    <motion.div 
      className="os-window"
      variants={variants}
      initial="initial"
      animate={isMinimized ? "minimized" : "open"}
      drag={!isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ position: 'relative' }}
    >
      <div 
        className="os-titlebar" 
        onPointerDown={(e) => dragControls.start(e)}
        style={{ cursor: "grab", touchAction: "none" }}
        title="Drag to move"
      >
        <TrafficLights />
        <span>Product Notebook</span>
      </div>
      
      <div className="notebook-bg">
        {children}
      </div>
    </motion.div>
  );
}
