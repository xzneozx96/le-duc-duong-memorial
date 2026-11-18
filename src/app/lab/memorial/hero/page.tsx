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
    id: "e1",
    name: "Khuê Văn Các · the pavilion of learning",
    note: "His cut-out portrait stands in front of Khuê Văn Các at the Temple of Literature (an autochrome from about 1915, CC0), graded to warm sepia and softened so he is the sharp plane. Name, dates and the one line sit bottom-left on the darker courtyard. Arrival: a slow film pan across the courtyard while he rises into place; on scroll the courtyard sinks and the page goes to warm dark.",
  },
  {
    id: "e2",
    name: "Sương sớm Moritzburg · morning mist at Moritzburg",
    note: "Light and quiet. A group photo from his own collection (picked by the owner), graded into a sepia mist. His whole portrait stands large on the left on desktop with his name, dates and one line about his students beside him; on a phone the portrait sits above the name. The mist clears on arrival; on scroll it closes over him.",
  },
  {
    id: "e3",
    name: "Bia đá · names kept in stone",
    note: "Split screen. Left: the corridor of the doctors' stelae at the Temple of Literature, where Hà Nội keeps the names of its scholars in stone, with him in front. Right: his name one word to a line, like an inscription, cut into the page word by word on arrival. On scroll the corridor recedes behind him.",
  },
  {
    id: "e4",
    name: "Giảng đường · the empty lecture hall",
    note: "Warm dark. An empty lecture hall after the lesson, rows of wooden seats facing the board, blurred and graded down. He stands at the front; at desktop width his name sits on the board above him. Arrival: the room's light comes up slowly; on scroll the view walks forward toward the board.",
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
      <p style={{ color: "#3a342e", marginTop: 12 }}>
        Four new heroes. Each one puts his cut-out portrait in front of a different public photograph that stands for
        a teacher&apos;s life and a farewell, graded into the Farewell palette. The words are the same in every option:
        Nhà giáo Lê Đức Dương, 01.05.1942 – 11.11.2026 and one line about his teaching. Each has its own entrance and
        scroll motion, a still version for readers who turn motion off, and the first block of the page below it.
        Reload an option to see its entrance again. Not product code; hidden in production unless LAB_ENABLED is set.
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
            <p style={{ margin: "4px 0 0", color: "#3a342e" }}>{o.note}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}
