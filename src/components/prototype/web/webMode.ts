// Which layout a website prototype's screens render: the phone site (mSite) or the desktop site.
// Set by the viewer's mSite / Desktop switch; phones always get "msite".
import { createContext, useContext } from "react";

export type WebMode = "msite" | "desktop";
export const WebModeContext = createContext<WebMode>("msite");
export const useDesktop = () => useContext(WebModeContext) === "desktop";
