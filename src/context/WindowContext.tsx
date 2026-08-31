"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type WindowContextType = {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  return (
    <WindowContext.Provider value={{ isMinimized, setIsMinimized, activeTab, setActiveTab }}>
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
