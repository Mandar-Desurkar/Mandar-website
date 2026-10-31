"use client";

import { kissanScreenMap } from "@/components/prototype/kissan/screenMap";
import { kissanSampurnaPrototype } from "@/data/prototypes/kissanSampurna";
import LiveApp, { type LiveAppProps } from "./LiveApp";

export default function LiveKissan(props: LiveAppProps) {
  return <LiveApp prototype={kissanSampurnaPrototype} screens={kissanScreenMap} {...props} />;
}
