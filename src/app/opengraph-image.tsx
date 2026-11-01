import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { kpis, profile } from "@/data/resume";

// The card LinkedIn, WhatsApp and Slack show when someone shares the site
export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/profile-avatar.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#f5f5f7",
          background: "radial-gradient(900px 500px at 85% 110%, rgba(255,150,70,0.45), transparent 70%), linear-gradient(160deg, #0b1424 0%, #06090f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <img src={src} width={180} height={180} alt="" style={{ borderRadius: 999, objectFit: "cover" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2 }}>{profile.name}</div>
            <div style={{ marginTop: 6, fontSize: 32, color: "rgba(235,235,245,0.72)" }}>{profile.role}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, fontSize: 26, color: "#7ee2a0" }}>
              <div style={{ width: 14, height: 14, borderRadius: 999, background: "#34c759" }} />
              {profile.availability}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 56 }}>
          {kpis.map((k) => (
            <div key={k.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 58, fontWeight: 700 }}>{`${k.prefix}${k.value}${k.suffix}`}</div>
              <div style={{ fontSize: 24, color: "rgba(235,235,245,0.6)" }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
