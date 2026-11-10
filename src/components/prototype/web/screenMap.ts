// Screen id → component for the Gau Sampurna website prototype. Every screen renders both the
// phone layout (mSite) and the desktop layout; the viewer's switch picks one (WebModeContext).
import type { ComponentType } from "react";
import type { ScreenProps } from "../kissan/KissanScreens";
import GsHome from "./GsHome";
import { GsProduct, GsProducts } from "./GsShop";
import { GsCheckout, GsConfirmed } from "./GsCheckout";
import { GsSwastha, GsTrading, GsVet } from "./GsServices";

export const gauWebScreenMap: Record<string, ComponentType<ScreenProps>> = {
  "gw-home": GsHome,
  "gw-products": GsProducts,
  "gw-product": GsProduct,
  "gw-checkout": GsCheckout,
  "gw-confirmed": GsConfirmed,
  "gw-swastha": GsSwastha,
  "gw-trading": GsTrading,
  "gw-vet": GsVet,
};
