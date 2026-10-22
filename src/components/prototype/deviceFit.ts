import type { PrototypeDevice } from "@/data/prototypes/kissanSampurna";

// How to draw an app's screens on a phone `phoneWidth` points wide so text and spacing come out at
// the size that phone shows in the real app. The screens are written in the app's design points;
// `scale` is the transform applied to them and `layoutWidth` the width (in design points) they lay
// out in so the screen exactly fills the phone. Kissan's `@ms` sizes grow at half the width ratio,
// so wider phones also get more room in design points, as in the app; Gau scales linearly.
export function fitToPhone(device: PrototypeDevice, phoneWidth: number) {
  const ratio = phoneWidth / device.width;
  const scale = device.scaling === "moderate" ? 1 + (ratio - 1) * 0.5 : ratio;
  return { scale, layoutWidth: phoneWidth / scale };
}
