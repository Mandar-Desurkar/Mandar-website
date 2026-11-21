// Interactive prototype of the Sales CRM inside the Silo ERP, from a telecaller's side only: the
// leads list, a lead's profile, the click-to-call softphone, booking an order during the call and
// the disposition that closes it. Recreated from the ERP frontend's own code (prod branch, read-only
// reference, 21 Nov 2026): layout, theme tokens (dark by default, Light works), copy, stages,
// dispositions, validation rules and messages are the ERP's. Every lead, phone number, agent and
// order is invented, because the real CRM holds customers' phone numbers; products and prices are
// the Gau Sampurna catalogue. Nothing is called or sent.
// Each screen renders the phone layout or the desktop layout, switched in the viewer.
import type { Prototype } from "./kissanSampurna";
import { DOMAIN } from "@/components/prototype/crm/crmData";

export const salesCrmPrototype: Prototype = {
  id: "sales-crm",
  name: "Sales CRM",
  tagline: "The telecaller's CRM: lead to order on one call",
  logo: "/prototypes/sales-crm/logo.png",
  device: { width: 390, height: 844, scaling: "none" },
  // Telecallers work on desktops, so the viewer opens the desktop layout; mSite shows the phone one
  web: { domain: DOMAIN, desktop: { width: 1280, height: 760 }, defaultMode: "desktop" },
  flows: [
    {
      id: "lead-to-order",
      title: "Lead to order",
      summary: "Leads → profile → call → order on the call → hang up → disposition",
      screens: [
        {
          id: "crm-leads",
          title: "Manage Leads",
          path: "/telecaller/crm",
          note: "150+ telecallers replaced an Excel sheet with this list. Next to each name sit the three things that decide who to call next: calls attempted, last activity and the last disposition, so a lead rung four times this morning doesn't get a fifth. The phone icon opens the lead and dials in one tap. Filters cover stage, source and state, with one-tap date ranges (Today, Yesterday, This Month) for created, last activity and order date. On a phone the grid becomes cards with a 44px Call button. Try it: filter by stage, then open Ramesh Gowda.",
        },
        {
          id: "crm-lead",
          title: "Lead profile",
          path: `/telecaller/crm/leads/7f3a21c9b4`,
          note: "Everything about a lead on one page, so an agent never switches tools mid-call: who they are and their stage on the left, every touch on the timeline, notes on the right. Ramesh filled a Facebook lead form 25 minutes ago; the CRM captured him on its own and assigned him to an agent. His number is a button: calls go out through the in-browser softphone, not the agent's personal phone, so every call is recorded and logged against the lead. Try it: click the number.",
        },
        {
          id: "crm-call",
          title: "On the call",
          path: `/telecaller/crm/leads/7f3a21c9b4?action=call`,
          note: "The softphone sits bottom-right and is mounted around every CRM page, so a call survives moving between the list and a lead. The sidebar confirms \"Connected — talk to the customer.\" Booking happens while the customer is still on the line, not after: Create Order is one click away. (Inbound calls work the other way round: the ringing number opens its lead, or creates one if the caller is new, so the agent has context before saying hello.) Try it: Create Order.",
        },
        {
          id: "crm-order",
          title: "Create order",
          path: `/telecaller/crm/leads/7f3a21c9b4`,
          note: "Built to be filled in while talking. Everything known is already there: name, phone, address, and the pincode, which fills taluk, district and state and says straight away whether an outlet delivers there (yellow means not yet; the order still goes through and is assigned later). Required fields are red until filled, optional ones yellow. Pricing guards margin: the company's discount is pre-applied, and an agent can add at most 10% of the selling price more; go past it and the reason appears under the field. If the customer already has an open order, the drawer opens in amend mode instead of letting a duplicate through. Try it: pick a product, Add Item, pick a delivery date, Create Order.",
        },
        {
          id: "crm-placed",
          title: "Order placed",
          path: `/telecaller/crm/leads/7f3a21c9b4`,
          note: "The order lands on the timeline (its number links to the order), in Customer Orders and in the Orders count, while the customer is still on the line, so the agent can read back the order number and delivery date. Any address the agent corrected in the order form is written back to the lead. Try it: Hang up in the softphone.",
        },
        {
          id: "crm-disposition",
          title: "Call disposition",
          path: `/telecaller/crm/leads/7f3a21c9b4`,
          note: "After every call the disposition drawer opens on its own and has no Cancel: no call goes unrecorded, so every call counts in the agent performance reports. Connected is pre-filled from the call record, because the phone SDK can't tell whether the customer picked up. There are only two top-level answers, Connected and Not Connected, because every report groups on them; the reasons under Connected are written per brand (dairy for Gau Sampurna). Some reasons ask one follow-up: Call Back needs a date and time, \"Dairy Farmer Not Looking For Anything\" asks how many cows. Try it: pick Order Booked and save.",
        },
        {
          id: "crm-logged",
          title: "Call logged",
          path: `/telecaller/crm/leads/7f3a21c9b4`,
          note: "One timeline row per call: direction, outcome, the disposition and the recording, with the call's real duration folded in from the call record. A team lead can audit any call from here, and the next agent who opens Ramesh sees the whole story. Back on Manage Leads, his row now shows 1 call and \"Order Booked\". Try it: Play recording.",
        },
      ],
    },
    {
      id: "lead-profile",
      title: "Lead profile",
      summary: "Activity History, Lead Details, Tasks and Orders tabs",
      screens: [
        {
          id: "crm-p-activity",
          title: "Activity History",
          path: `/telecaller/crm/leads/7f3a21c9b4?tab=activity`,
          note: "Every touch in one place, newest first: created, assigned, calls with recordings, orders, field changes and notes, each with who did it and when (IST). Filter by type or by day when a lead has a long history. Whatever you did in the first flow shows up here.",
        },
        {
          id: "crm-p-details",
          title: "Lead Details",
          path: `/telecaller/crm/leads/7f3a21c9b4?tab=details`,
          note: "All of the lead's fields, with \"Hide empty fields\" for a quick read. Form Answers are the lead form's questions exactly as the farmer answered them, so the agent opens the call already knowing the herd size and the problem. Campaign / UTM records which ad brought the lead, so a campaign can be judged by the orders it brings, not just the leads.",
        },
        {
          id: "crm-p-tasks",
          title: "Tasks",
          path: `/telecaller/crm/leads/7f3a21c9b4?tab=tasks`,
          note: "For a call made outside the softphone, Log Call opens the same disposition form with Cancel and an Outbound / Inbound toggle, so even those calls end up on the timeline and in the reports.",
        },
        {
          id: "crm-p-orders",
          title: "Orders",
          path: `/telecaller/crm/leads/7f3a21c9b4?tab=orders`,
          note: "Every order on this number, with status and amount. An open order can be amended instead of re-booked: items an agent adds are credited to them, items removed come off the original agent's count, so sales credit stays fair. Book an order in the first flow and it appears here.",
        },
      ],
    },
  ],
};
