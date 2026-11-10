"use client";

// Gau Sampurna prototype, loaded on demand (next/dynamic) like KissanPrototype.
import PrototypeViewer from "./PrototypeViewer";
import { gauScreenMap } from "./gau/screenMap";
import { gauSampurnaPrototype } from "@/data/prototypes/gauSampurna";
import type { PrototypeId } from "@/context/WindowContext";

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: PrototypeId) => void;
};

export default function GauPrototype({ onClose, onSwitchPrototype }: Props) {
  return (
    <PrototypeViewer
      prototype={gauSampurnaPrototype}
      screens={gauScreenMap}
      onClose={onClose}
      onSwitchPrototype={onSwitchPrototype}
    />
  );
}
