import type { Metadata } from "next";
import Link from "next/link";
import { labGuard } from "@/components/lab/lab-guard";
import { bookFontVars } from "../_lab/book/fonts";

export const metadata: Metadata = {
  title: "Lab: Lưu bút options",
  robots: { index: false, follow: false },
};

const options = [
  {
    href: "/lab/memorial/book/a",
    title: "A: Thư gửi thầy (letters to him)",
    note: "A writing desk: every memory is an airmail letter stamped with the writer's photo and postmarked; one letter lies open at a time, and writing one folds it into an envelope that lands in the tray.",
  },
  {
    href: "/lab/memorial/book/b",
    title: "B: Đèn hoa đăng (lanterns on the river), recommended",
    note: "After the tribute, a dusk river where each memory is a lotus lantern carrying a name; a lantern lifts its letter out of the river onto a lit paper page, and writing one sets a new lantern on the water.",
  },
  {
    href: "/lab/memorial/book/c",
    title: "C: Lời kể (the reading room)",
    note: "A documentary in chapters: every letter printed in full, the writer's photos holding the left half of the screen and changing as you read; the calmest for long letters.",
  },
  {
    href: "/lab/memorial/book/d",
    title: "D: Những năm tháng (the years beside him)",
    note: "His years from 1955 to 2026 on a forest band, each letter hung at its writer's year, so the Thanh Xuân years fill with students' names; a name opens its letter below with the year set large.",
  },
  {
    href: "/lab/memorial/book/e",
    title: "E: Mặt sau tấm ảnh (the back of the photograph)",
    note: "A wall of prints hung salon-style with museum labels; a print turns over to show the letter written on its back, and writing one starts on the back of a blank card.",
  },
];

export default function Page() {
  labGuard();
  return (
    <main className={bookFontVars} style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px", fontFamily: "var(--font-lbk-sans), system-ui, sans-serif", fontSize: 18, lineHeight: 1.55, color: "#17082d", background: "#f9f8f7", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 34, margin: 0 }}>Lab: Lưu bút, five options</h1>
      <p style={{ color: "#313d36" }}>
        Five different ideas for the guestbook, each with the tribute of Cao Hữu Ngạn first, the six sample letters (four with
        photos) and a working form (nothing is sent; a new letter lasts until reload). Each page ends with a note on what it tries
        and its trade-offs. Not product code; hidden in production unless LAB_ENABLED is set.
      </p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 32, display: "grid", gap: 28 }}>
        {options.map((o) => (
          <li key={o.href}>
            <Link href={o.href} style={{ fontSize: 22, fontWeight: 600, color: "#17082d" }}>
              {o.title}
            </Link>
            <p style={{ margin: "6px 0 0", color: "#313d36" }}>{o.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
