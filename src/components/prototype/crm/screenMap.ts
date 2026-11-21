// Screen id → component for the Sales CRM prototype. Every screen renders both the phone layout and
// the desktop layout; the viewer's switch picks one (WebModeContext).
import type { ComponentType } from "react";
import type { ScreenProps } from "../kissan/KissanScreens";
import CrmLeadsScreen from "./CrmLeads";
import {
  CrmCallScreen, CrmDispositionScreen, CrmLeadScreen, CrmLoggedScreen, CrmOrderScreen, CrmPlacedScreen,
  CrmProfileActivity, CrmProfileDetails, CrmProfileOrders, CrmProfileTasks,
} from "./CrmLead";

export const crmScreenMap: Record<string, ComponentType<ScreenProps>> = {
  "crm-leads": CrmLeadsScreen,
  "crm-lead": CrmLeadScreen,
  "crm-call": CrmCallScreen,
  "crm-order": CrmOrderScreen,
  "crm-placed": CrmPlacedScreen,
  "crm-disposition": CrmDispositionScreen,
  "crm-logged": CrmLoggedScreen,
  "crm-p-activity": CrmProfileActivity,
  "crm-p-details": CrmProfileDetails,
  "crm-p-tasks": CrmProfileTasks,
  "crm-p-orders": CrmProfileOrders,
};
