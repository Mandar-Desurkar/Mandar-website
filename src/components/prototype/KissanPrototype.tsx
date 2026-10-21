"use client";

// Entry point loaded on demand (next/dynamic) so the prototype's screens, styles and font
// never weigh down the initial page.
import PrototypeViewer from "./PrototypeViewer";
import { kissanScreens } from "./kissan/KissanScreens";
import { cropGuideScreens } from "./kissan/CropGuideScreens";
import { farmMonitoringScreens } from "./kissan/FarmMonitoringScreens";
import { homeWeatherScreens } from "./kissan/HomeWeatherScreens";
import { cropDoctorScreens } from "./kissan/CropDoctorScreens";
import { subscriptionScreens } from "./kissan/SubscriptionScreens";
import { kissanSampurnaPrototype } from "@/data/prototypes/kissanSampurna";

// Crop Doctor (prod branch design) + Home, Weather, Crop Guide and Farm Monitoring (dev branch design)
const screens = {
  ...homeWeatherScreens,
  ...kissanScreens,
  ...cropDoctorScreens,
  ...cropGuideScreens,
  ...farmMonitoringScreens,
  ...subscriptionScreens,
};

type Props = {
  onClose: () => void;
  onSwitchPrototype?: (id: "kissan-sampurna" | "gau-sampurna") => void;
};

export default function KissanPrototype({ onClose, onSwitchPrototype }: Props) {
  return (
    <PrototypeViewer
      prototype={kissanSampurnaPrototype}
      screens={screens}
      onClose={onClose}
      onSwitchPrototype={onSwitchPrototype}
    />
  );
}
