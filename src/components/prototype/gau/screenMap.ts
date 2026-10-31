import { gauHomeScreens } from "./GauHome";
import { gauHerdScreens } from "./GauHerd";
import { gauScanScreens } from "./GauScan";
import { gauReportScreens } from "./GauReports";
import { gauHistoryScreens } from "./GauHistory";
import { gauPrathamScreens } from "./GauPratham";
import { gauShopScreens } from "./GauShop";
import { gauTradingScreens } from "./GauTrading";
import { gauAccountScreens } from "./GauAccount";
import { gauWelcomeScreens } from "./GauWelcome";

// Every Gau screen map, keyed by screen id (flows and order live in gauSampurna.ts)
export const gauScreenMap = {
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
