"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BootScreen.module.css";
import { Monitor } from "lucide-react";

export default function BootScreen() {
  const [isBooting, setIsBooting] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Force scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 50); // 50ms * 20 = 1000ms

    // Unmount after 1.25 seconds (gives time for bar to fill and pause)
    const timeout = setTimeout(() => {
      setIsBooting(false);
    }, 1250);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isBooting && (
        <motion.div 
          className={styles.bootScreen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className={styles.content}>
            <Monitor size={64} className={styles.icon} />
            
            <h1 className={styles.title}>Welcome to Mandar Desurkar</h1>
            
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className={styles.statusText}>Starting up...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
