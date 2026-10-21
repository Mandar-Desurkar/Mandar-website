"use client";

// Renders the open app prototype once for the whole page (state lives in WindowContext), so it can
// be opened from the hero, Experience, Projects or the phone home screen and isn't unmounted when
// the visitor switches sections. Each prototype's code loads only when it is first opened.
import dynamic from "next/dynamic";
import { useWindow } from "@/context/WindowContext";

const KissanPrototype = dynamic(() => import("./KissanPrototype"), { ssr: false });
const GauPrototype = dynamic(() => import("./GauPrototype"), { ssr: false });

export default function PrototypeHost() {
  const { prototype, switchPrototype, closePrototype } = useWindow();
  if (prototype === "kissan-sampurna") return <KissanPrototype onClose={closePrototype} onSwitchPrototype={switchPrototype} />;
  if (prototype === "gau-sampurna") return <GauPrototype onClose={closePrototype} onSwitchPrototype={switchPrototype} />;
  return null;
}
