"use client";

// Entry point loaded on demand (next/dynamic) so the prototype's screens, styles and font
// never weigh down the initial page.
import PrototypeViewer from "./PrototypeViewer";
import { kissanScreens } from "./kissan/KissanScreens";
import { cropGuideScreens } from "./kissan/CropGuideScreens";
import { farmMonitoringScreens } from "./kissan/FarmMonitoringScreens";
import { kissanSampurnaPrototype } from "@/data/prototypes/kissanSampurna";

// Crop Doctor (prod branch design) + Crop Guide and Farm Monitoring (dev branch design)
const screens = { ...kissanScreens, ...cropGuideScreens, ...farmMonitoringScreens };

export default function KissanPrototype({ onClose }: { onClose: () => void }) {
  return <PrototypeViewer prototype={kissanSampurnaPrototype} screens={screens} onClose={onClose} />;
}
