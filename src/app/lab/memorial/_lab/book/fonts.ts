import { Be_Vietnam_Pro, Source_Serif_4 } from "next/font/google";

// Faces of the Lưu bút options: the owner's pair. Source Serif 4 (optical sizes, with its true
// italic for signatures) for every word that is read, Be Vietnam Pro for small labels and controls.
// Both carry every Vietnamese letter and ä ö ü ß.
export const bookSerif = Source_Serif_4({
  variable: "--font-lbk-serif",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});
export const bookSans = Be_Vietnam_Pro({
  variable: "--font-lbk-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600"],
  display: "swap",
});

export const bookFontVars = [bookSerif, bookSans].map((f) => f.variable).join(" ");
