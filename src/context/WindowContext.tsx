"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { trackEvent, secondsSince } from '@/lib/analytics';

export type SectionId = 'about' | 'experience' | 'education' | 'projects' | 'contact';
export type PrototypeId = 'kissan-sampurna' | 'gau-sampurna';
export type PrototypePlacement = 'hero' | 'experience' | 'projects' | 'home_screen' | 'deep_link' | 'spotlight';
export type OpenSource = 'desktop_icon' | 'menu_bar' | 'system_menu' | 'hero_cta' | 'notification' | 'mobile_dock' | 'home_widget' | 'spotlight';

type WindowContextType = {
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
  isMaximized: boolean;
  setIsMaximized: (value: boolean) => void;
  isClosed: boolean;
  setIsClosed: (value: boolean) => void;
  activeTab: SectionId;
  setActiveTab: (tab: SectionId) => void;
  // Single entry point for opening a section: shows the window and tracks where it came from
  openSection: (id: SectionId, source: OpenSource) => void;
  // True once the visitor has opened Contact this visit (used to skip conversion nudges)
  hasOpenedContact: boolean;
  // The open app prototype (rendered once by PrototypeHost, so any section or the phone home
  // screen can open it and it survives switching sections). Mirrored in ?prototype= for sharing.
  prototype: PrototypeId | null;
  openPrototype: (id: PrototypeId, placement: PrototypePlacement) => void;
  switchPrototype: (id: PrototypeId) => void;
  closePrototype: () => void;
};

function setPrototypeParam(id: PrototypeId | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set('prototype', id);
  else url.searchParams.delete('prototype');
  window.history.replaceState({}, '', url.toString());
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [activeTab, setActiveTab] = useState<SectionId>('about');
  const [hasOpenedContact, setHasOpenedContact] = useState(false);
  const [prototype, setPrototype] = useState<PrototypeId | null>(null);

  const openPrototype = (id: PrototypeId, placement: PrototypePlacement) => {
    trackEvent('Opened Prototype', { prototype: id, placement });
    setPrototype(id);
    setPrototypeParam(id);
  };
  const switchPrototype = (id: PrototypeId) => {
    setPrototype(id);
    setPrototypeParam(id);
  };
  const closePrototype = () => {
    setPrototype(null);
    setPrototypeParam(null);
  };

  // Deep link (?prototype=…, from "Share prototype"). Read after mount so the server and client
  // HTML match.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const protoId = params.get('prototype');
    if (protoId === 'kissan-sampurna' || protoId === 'gau-sampurna') {
      const raf = requestAnimationFrame(() => {
        trackEvent('Opened Prototype', { prototype: protoId, placement: 'deep_link' });
        setPrototype(protoId);
      });
      return () => cancelAnimationFrame(raf);
    }

    // Default to the mobile home screen (window closed) when opening on phone/touch layout
    try {
      const MOBILE_QUERY = "(max-width: 767.98px), (max-width: 1023.98px) and (pointer: coarse), (max-height: 500px) and (pointer: coarse)";
      if (window.matchMedia(MOBILE_QUERY).matches && !params.has('section')) {
        setIsClosed(true);
      }
    } catch {}
  }, []);

  const openSection = (id: SectionId, source: OpenSource) => {
    trackEvent('Opened Section', {
      section: id,
      source,
      previous_section: activeTab,
      window_was_open: !isClosed && !isMinimized,
    });
    setActiveTab(id);
    setIsMinimized(false);
    setIsClosed(false);
    if (id === 'contact') setHasOpenedContact(true);
  };

  // Dwell time: a span starts when a section becomes visible and is reported when it stops.
  const spanRef = useRef<{ section: SectionId; start: number } | null>(null);
  const viewRef = useRef({ section: activeTab, visible: true });

  useEffect(() => {
    const visible = !isClosed && !isMinimized;
    viewRef.current = { section: activeTab, visible };
    const span = spanRef.current;
    if (span && (!visible || span.section !== activeTab)) {
      trackEvent('Left Section', {
        section: span.section,
        seconds_visible: secondsSince(span.start),
        reason: !visible ? (isClosed ? 'closed' : 'minimized') : 'switched',
      });
      spanRef.current = null;
    }
    if (visible && !spanRef.current) {
      spanRef.current = { section: activeTab, start: performance.now() };
    }
  }, [activeTab, isClosed, isMinimized]);

  // Leaving the browser tab ends the span; coming back starts a new one.
  useEffect(() => {
    const onVisibilityChange = () => {
      const span = spanRef.current;
      if (document.visibilityState === 'hidden' && span) {
        trackEvent('Left Section', {
          section: span.section,
          seconds_visible: secondsSince(span.start),
          reason: 'page_hidden',
        });
        spanRef.current = null;
      } else if (document.visibilityState === 'visible' && !spanRef.current && viewRef.current.visible) {
        spanRef.current = { section: viewRef.current.section, start: performance.now() };
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <WindowContext.Provider value={{
      isMinimized, setIsMinimized,
      isMaximized, setIsMaximized,
      isClosed, setIsClosed,
      activeTab, setActiveTab,
      openSection,
      hasOpenedContact,
      prototype, openPrototype, switchPrototype, closePrototype,
    }}>
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
