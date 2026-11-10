"use client";

// The Gau Sampurna website (gausampurna.com) as a prototype, on demand from PrototypeHost.
import { useEffect } from "react";
import PrototypeViewer from "./PrototypeViewer";
import { gauWebScreenMap } from "./web/screenMap";
import { cartActions } from "./web/gsData";
import { gauSampurnaWebPrototype } from "@/data/prototypes/gauSampurnaWeb";
import type { PrototypeId } from "@/context/WindowContext";

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: PrototypeId) => void;
};

export default function GauWebPrototype({ onClose, onSwitchPrototype }: Props) {
  // Each visit starts with an empty sample cart
  useEffect(() => cartActions.reset(), []);
  return (
    <PrototypeViewer prototype={gauSampurnaWebPrototype} screens={gauWebScreenMap} onClose={onClose} onSwitchPrototype={onSwitchPrototype} />
  );
}
