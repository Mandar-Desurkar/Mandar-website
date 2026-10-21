"use client";

// Gau Sampurna prototype, loaded on demand (next/dynamic) like KissanPrototype.
import PrototypeViewer from "./PrototypeViewer";
import { gauScreens } from "./gau/GauScreens";
import { gauSampurnaPrototype } from "@/data/prototypes/gauSampurna";

export default function GauPrototype({ onClose }: { onClose: () => void }) {
  return <PrototypeViewer prototype={gauSampurnaPrototype} screens={gauScreens} onClose={onClose} />;
}
