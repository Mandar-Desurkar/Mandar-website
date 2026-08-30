"use client";

import { motion, useDragControls } from "framer-motion";
import TrafficLights from "./TrafficLights";

export default function DraggableWindow({ children }: { children: React.ReactNode }) {
  const dragControls = useDragControls();

  return (
    <motion.div 
      className="os-window"
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
      drag
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
