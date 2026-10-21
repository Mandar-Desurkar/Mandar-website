"use client";

// Gau Sampurna prototype, loaded on demand (next/dynamic) like KissanPrototype.
import PrototypeViewer from "./PrototypeViewer";
import { gauHomeScreens } from "./gau/GauHome";
import { gauHerdScreens } from "./gau/GauHerd";
import { gauScanScreens } from "./gau/GauScan";
import { gauReportScreens } from "./gau/GauReports";
import { gauHistoryScreens } from "./gau/GauHistory";
import { gauPrathamScreens } from "./gau/GauPratham";
import { gauShopScreens } from "./gau/GauShop";
import { gauTradingScreens } from "./gau/GauTrading";
import { gauAccountScreens } from "./gau/GauAccount";
import { gauWelcomeScreens } from "./gau/GauWelcome";
import { gauSampurnaPrototype } from "@/data/prototypes/gauSampurna";

// Every Gau screen map, keyed by screen id (flows and order live in gauSampurna.ts)
const screens = {
  ...gauWelcomeScreens,
  ...gauHomeScreens,
  ...gauHerdScreens,
  ...gauScanScreens,
  ...gauReportScreens,
  ...gauHistoryScreens,
  ...gauPrathamScreens,
  ...gauShopScreens,
  ...gauTradingScreens,
  ...gauAccountScreens,
};

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
};

export default function GauPrototype({ onClose, onSwitchPrototype }: Props) {
  return (
    <PrototypeViewer
      prototype={gauSampurnaPrototype}
      screens={screens}
      onClose={onClose}
      onSwitchPrototype={onSwitchPrototype}
    />
  );
}
