"use client";

// Entry point loaded on demand (next/dynamic) so the prototype's screens, styles and font
// never weigh down the initial page.
import PrototypeViewer from "./PrototypeViewer";
import { kissanScreenMap } from "./kissan/screenMap";
import { kissanSampurnaPrototype } from "@/data/prototypes/kissanSampurna";


type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
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
