"use client";

// Entry point loaded on demand (next/dynamic) so the prototype's screens, styles and font
// never weigh down the initial page.
import PrototypeViewer from "./PrototypeViewer";
import { kissanScreenMap } from "./kissan/screenMap";
import { kissanSampurnaPrototype } from "@/data/prototypes/kissanSampurna";
import type { PrototypeId } from "@/context/WindowContext";

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: PrototypeId) => void;
};

export default function KissanPrototype({ onClose, onSwitchPrototype }: Props) {
  return (
    <PrototypeViewer
      prototype={kissanSampurnaPrototype}
      screens={kissanScreenMap}
      onClose={onClose}
      onSwitchPrototype={onSwitchPrototype}
    />
  );
}
