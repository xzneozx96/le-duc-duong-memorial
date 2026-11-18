import type { Metadata } from "next";
import { Be_Vietnam_Pro, Literata } from "next/font/google";
import "./globals.css";

// Literata (roman only) for story and memories, Be Vietnam Pro for boards, years and controls.
// The vietnamese subset is required, or ằ ẫ ệ ộ ữ ợ Đ fall back to a system font (AC-5).
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  weight: ["400", "500", "600"],
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nhà giáo Lê Đức Dương",
  description: "Trang tưởng nhớ Nhà giáo Lê Đức Dương (01.05.1942 – 11.11.2026).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${literata.variable} ${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
