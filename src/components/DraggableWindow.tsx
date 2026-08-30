"use client";

import { motion, useDragControls } from "framer-motion";
import TrafficLights from "./TrafficLights";

export default function DraggableWindow({ children }: { children: React.ReactNode }) {
  const dragControls = useDragControls();

  return (
    <motion.div 
      className="os-window"
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
