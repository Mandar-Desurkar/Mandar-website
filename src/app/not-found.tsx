import Link from "next/link";

// A missing page, styled as a desktop alert rather than a blank error
export default function NotFound() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, background: "#0a0e16", color: "#f5f5f7" }}>
      <div style={{ maxWidth: 380, padding: "28px 28px 24px", borderRadius: 16, textAlign: "center", background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.16), 0 30px 80px rgba(0,0,0,0.5)" }}>
        <p style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">🛟</p>
        <h1 style={{ marginTop: 14, fontSize: 20, fontWeight: 700 }}>This page isn&apos;t here</h1>
        <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: "rgba(235,235,245,0.68)" }}>
          The link may be old or mistyped. Everything else is one click away.
        </p>
        <Link href="/" style={{ display: "inline-block", marginTop: 18, padding: "9px 18px", borderRadius: 999, background: "#fff", color: "#0a0e16", fontSize: 14, fontWeight: 600 }}>
          Back to the desktop
        </Link>
      </div>
    </main>
  );
}
