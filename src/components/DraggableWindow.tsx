"use client";

import { motion, useDragControls, Variants } from "framer-motion";
import TrafficLights from "./TrafficLights";
import { useWindow } from "@/context/WindowContext";
import { useEffect, useState } from "react";

export default function DraggableWindow({ 
  title, 
  children
}: { 
  title: string | React.ReactNode, 
  children: React.ReactNode
}) {
  const dragControls = useDragControls();
  const { isMinimized } = useWindow();
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      className="os-window absolute-window"
      variants={variants}
      initial="initial"
      animate={isMinimized ? "minimized" : "open"}
      drag={!isMinimized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      style={{ position: 'absolute', zIndex: 10 }}
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
      
      <div className="notebook-bg">
        {children}
      </div>
    </motion.div>
  );
}
