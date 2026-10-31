"use client";

// Gau Sampurna prototype, loaded on demand (next/dynamic) like KissanPrototype.
import PrototypeViewer from "./PrototypeViewer";
import { gauScreenMap } from "./gau/screenMap";
import { gauSampurnaPrototype } from "@/data/prototypes/gauSampurna";


type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
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
