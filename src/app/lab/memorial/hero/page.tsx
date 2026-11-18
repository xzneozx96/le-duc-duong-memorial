import type { Metadata } from "next";
import Link from "next/link";
import { labGuard } from "@/components/lab/lab-guard";
import { demoFontVars } from "../_lab/demo/fonts";

export const metadata: Metadata = {
  title: "Lab: hero options",
  robots: { index: false, follow: false },
};

const options = [
  {
    id: "d",
    name: "Một đời · a whole life (the owner's pick)",
    note: "His name very large; one line of his photographs through the middle with his portrait at the centre, black-and-white years to the left, colour to the right, smaller with distance from today. Opens as a contact sheet that gathers into the line (GSAP Flip).",
  },
  {
    id: "d2",
    name: "Quạt ảnh · the fanned prints",
    note: "The line held like a hand of prints: his portrait in front, the years fanned out behind it, overlapping and tilting a little more each time. They fan out from behind him on arrival and gather back behind him as you scroll away.",
  },
  {
    id: "d3",
    name: "Dệt chữ · woven into his name",
    note: "The photographs stand inside the name between the words, at the height of the capitals: Moritzburg before Lê, the young man before Đức, colour reunions after Dương, his portrait closing the block. They open up between the words on arrival.",
  },
  {
    id: "d4",
    name: "Cuộn phim · the reel",
    note: "The line as a strip of film with his portrait in the gate. Scrolling winds the film back and each faded earlier photograph comes back to full tone as it passes him, handing over to the films section. Recommended if one scroll idea is wanted.",
  },
  {
    id: "d5",
    name: "Thành dòng đời · the line becomes his life story",
    note: "D's first screen, then as you scroll each photograph leaves the line and travels down to its station in the life story below (Moritzburg, Magdeburg, Thanh Xuân, Germany) while the line turns into the timeline.",
  },
];

export default function HeroIndex() {
  labGuard();
  return (
    <main
      className={demoFontVars}
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "48px 20px 80px",
        fontFamily: "var(--font-lm-sans), system-ui, sans-serif",
        fontSize: 18,
        lineHeight: 1.6,
        color: "#17082d",
        background: "#f9f8f7",
        minHeight: "100vh",
      }}
    >
      <p style={{ margin: 0 }}>
        <Link href="/lab/memorial" style={{ color: "#17082d", display: "inline-flex", minHeight: 48, alignItems: "center" }}>
          ← Lab: memorial
        </Link>
      </p>
      <h1 style={{ fontFamily: "var(--font-lm-serif), Georgia, serif", fontWeight: 400, fontSize: 44, lineHeight: 1.15, margin: "8px 0 0" }}>
        Hero options
      </h1>
      <p style={{ color: "#4a3f55", marginTop: 12 }}>
        Option D, the owner&apos;s pick, and four variations that push its idea further: his life as a line of real
        photographs around his portrait, the past in black and white turning to colour toward today. Each has its
        entrance, a still version for readers who turn motion off, and the first part of the page below it. D4 and D5
        show their idea while scrolling. Same words and links in
        every option: Nhà giáo Lê Đức Dương, Một ánh Dương còn mãi, 01.05.1942 – 11.11.2026, Lưu bút, Thước phim,
        Cuộc đời. Reload an option to see its entrance again. Not product code; hidden in production unless
        LAB_ENABLED is set.
      </p>
      <ol style={{ listStyle: "none", padding: 0, margin: "36px 0 0", display: "grid", gap: 30 }}>
        {options.map((o) => (
          <li key={o.id} style={{ borderTop: "1px solid #d6c0a7", paddingTop: 20 }}>
            <Link
              href={`/lab/memorial/hero/${o.id}`}
              style={{
                fontFamily: "var(--font-lm-serif), Georgia, serif",
                fontSize: 28,
                color: "#17082d",
                display: "inline-flex",
                minHeight: 48,
                alignItems: "center",
              }}
            >
              {o.id.toUpperCase()} · {o.name}
            </Link>
            <p style={{ margin: "4px 0 0", color: "#4a3f55" }}>{o.note}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
