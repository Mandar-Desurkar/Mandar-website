"use client";

import { gauScreenMap } from "@/components/prototype/gau/screenMap";
import { gauSampurnaPrototype } from "@/data/prototypes/gauSampurna";
import LiveApp, { type LiveAppProps } from "./LiveApp";

export default function LiveGau(props: LiveAppProps) {
  return <LiveApp prototype={gauSampurnaPrototype} screens={gauScreenMap} {...props} />;
}
