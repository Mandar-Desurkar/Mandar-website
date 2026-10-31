"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const COUNT_DURATION_S = 0.7;

// Counts 0 → `to` with an ease-out, then shows the clean final value.
export default function CountUp({ to, decimals, delay }: { to: number; decimals: number; delay: number }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  // Render depends only on `value` so server and client HTML match; with reduced motion the
  // number jumps straight to its final value instead of counting
  useEffect(() => {
    const controls = animate(0, to, {
      duration: reduceMotion ? 0 : COUNT_DURATION_S,
      delay: reduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [to, delay, reduceMotion]);

  if (value >= to) return <>{to}</>;
  return <>{decimals ? value.toFixed(decimals) : Math.round(value)}</>;
}
