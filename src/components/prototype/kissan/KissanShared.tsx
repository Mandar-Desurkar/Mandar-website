"use client";

// Shared Kissan Sampurna prototype UI: the bottom tab bar ((tabs)/_layout.jsx), CustomAlert
// (code/components/CustomAlert.jsx) and a bottom sheet. Overlays are absolutely positioned inside the
// phone screen, so a screen root must be position: relative.
import type { ComponentType, ReactNode } from "react";
import { X } from "lucide-react";
import ui from "./kissanShared.module.css";
import type { ScreenProps } from "./KissanScreens";
import { AccountTabIcon, GuideTabIcon, HomeTabIcon, MonitorTabIcon, ScanTabIcon } from "./KissanIcons";

export { ui };

export type KissanTab = "home" | "guide" | "scan" | "monitor" | "account";

const TABS: { key: KissanTab; label: string; Icon: ComponentType<{ size?: number }>; flow?: string }[] = [
  { key: "home", label: "Home", Icon: HomeTabIcon, flow: "home-weather" },
  { key: "guide", label: "Guide", Icon: GuideTabIcon, flow: "crop-guide" },
  { key: "scan", label: "Scan", Icon: ScanTabIcon, flow: "crop-doctor" },
  { key: "monitor", label: "Monitor", Icon: MonitorTabIcon, flow: "farm-monitoring" },
  { key: "account", label: "Account", Icon: AccountTabIcon },
];

export function KissanTabBar({ active, goToFlow }: { active: KissanTab; goToFlow: ScreenProps["goToFlow"] }) {
  return (
    <nav className={ui.tabBar} aria-label="App tabs">
      {TABS.map(({ key, label, Icon, flow }) => (
        <button
          key={key}
          type="button"
          className={`${ui.btnReset} ${ui.tab} ${key === active ? ui.tabActive : ""}`}
          onClick={flow && key !== active ? () => goToFlow(flow) : undefined}
          aria-current={key === active ? "page" : undefined}
        >
          <Icon size={22} />
          {label}
        </button>
      ))}
    </nav>
  );
}

export type AlertButton = { text: string; type?: "primary" | "secondary" | "danger"; onPress: () => void };

export function KAlert({
  title,
  message,
  icon,
  buttons,
  onClose,
}: {
  title: string;
  message?: ReactNode;
  icon?: ReactNode;
  buttons: AlertButton[];
  onClose?: () => void;
}) {
  return (
    <div className={ui.overlay} onClick={onClose} role="presentation">
      <div className={ui.alert} role="alertdialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button type="button" className={`${ui.btnReset} ${ui.alertClose}`} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        )}
        {icon && <div className={ui.alertIcon}>{icon}</div>}
        <p className={ui.alertTitle}>{title}</p>
        {message && <p className={ui.alertMessage}>{message}</p>}
        <div className={ui.alertButtons}>
          {buttons.map((b) => (
            <button
              key={b.text}
              type="button"
              className={`${ui.btnReset} ${ui.alertBtn} ${
                b.type === "secondary" ? ui.alertSecondary : b.type === "danger" ? ui.alertDanger : ui.alertPrimary
              }`}
              onClick={b.onPress}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function KSheet({ children, onClose, label }: { children: ReactNode; onClose: () => void; label: string }) {
  return (
    <div className={ui.sheetOverlay} onClick={onClose} role="presentation">
      <div className={ui.sheet} role="dialog" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <div className={ui.sheetHandle} />
        {children}
      </div>
    </div>
  );
}
