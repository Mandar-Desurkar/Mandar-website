"use client";

// The Sales CRM (telecaller view of the Silo ERP) as a prototype, on demand from PrototypeHost.
import { useEffect } from "react";
import PrototypeViewer from "./PrototypeViewer";
import { crmScreenMap } from "./crm/screenMap";
import { crm } from "./crm/crmData";
import { salesCrmPrototype } from "@/data/prototypes/salesCrm";
import type { PrototypeId } from "@/context/WindowContext";

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: PrototypeId) => void;
};

export default function CrmPrototype({ onClose, onSwitchPrototype }: Props) {
  // Each visit starts from a fresh lead: no calls, no orders
  useEffect(() => crm.reset(), []);
  return <PrototypeViewer prototype={salesCrmPrototype} screens={crmScreenMap} onClose={onClose} onSwitchPrototype={onSwitchPrototype} />;
}
