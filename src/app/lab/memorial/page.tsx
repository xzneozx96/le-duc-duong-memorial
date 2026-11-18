import Link from "next/link";

const routes = [
  {
    href: "/lab/memorial/a",
    title: "A · The family album (safe)",
    note: "Warm paper, oxblood station plates, prints in white mounts with photo corners, a double rail with sleepers. On wide screens the station text stays in view while the prints scroll past. Closest to the brainstorm.",
  },
  {
    href: "/lab/memorial/b",
    title: "B · The night train (bold)",
    note: "Near-black page, the archive photos as film frames edge to edge, white enamel station signs hung from one rail, a bright amber title. Cinematic and quiet; light text on dark is harder for some older eyes.",
  },
  {
    href: "/lab/memorial/c",
    title: "C · Hà Nội daylight (bold)",
    note: "White page, big grotesque type, the colour photos large as magazine spreads, a broad ochre rail with green discs, the Lưu bút on a deep green field. Bright and alive; the archive years look smaller.",
  },
];

export default function LabIndex() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px", fontFamily: "var(--font-be-vietnam-pro), system-ui, sans-serif", fontSize: 18, lineHeight: 1.55, color: "#1c1a18", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 34, margin: 0 }}>Lab: memorial, round 1</h1>
      <p style={{ color: "#55524c" }}>
        Three visual directions for item 001. Each shows the first screen, the films, the Moritzburg and Germany stations and the start of the Lưu bút, with a Vietnamese and German switch. Texts and captions are samples. Not product code; hidden in production unless LAB_ENABLED is set.
      </p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 32, display: "grid", gap: 28 }}>
        {routes.map((r) => (
          <li key={r.href}>
            <Link href={r.href} style={{ fontSize: 22, fontWeight: 600, color: "#1c1a18" }}>
              {r.title}
            </Link>
            <p style={{ margin: "6px 0 0", color: "#55524c" }}>{r.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
