"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type WindowState = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
};

type WindowContextType = {
  windows: Record<string, WindowState>;
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

let highestZIndex = 10;

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    'about': { id: 'about', title: 'About Me', isOpen: true, isMinimized: false, zIndex: 10 }
  });

  const focusWindow = useCallback((id: string) => {
    highestZIndex += 1;
    setWindows(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: highestZIndex }
      };
    });
  }, []);

  const openWindow = useCallback((id: string, title: string) => {
    setWindows(prev => {
      const isAlreadyOpen = prev[id]?.isOpen;
      if (isAlreadyOpen) {
        if (prev[id].isMinimized) {
          // If it's minimized, restore it
          highestZIndex += 1;
          return { ...prev, [id]: { ...prev[id], isMinimized: false, zIndex: highestZIndex } };
        }
        // If it's just open, focus it
        highestZIndex += 1;
        return { ...prev, [id]: { ...prev[id], zIndex: highestZIndex } };
      }
      
      // Open new window
      highestZIndex += 1;
      return {
        ...prev,
        [id]: {
          id,
          title,
          isOpen: true,
          isMinimized: false,
          zIndex: highestZIndex
        }
      };
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true }
    }));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    highestZIndex += 1;
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, zIndex: highestZIndex }
    }));
  }, []);

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindow() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindow must be used within a WindowProvider');
  }
  return context;
}
