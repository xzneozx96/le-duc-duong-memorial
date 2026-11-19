import { Be_Vietnam_Pro, Source_Serif_4 } from "next/font/google";

// Faces of the page. Source Serif 4 is the owner's pick: one variable family with an
// optical-size axis, so the name is set with the display cut and the story with the text cut.
// Be Vietnam Pro, drawn for Vietnamese, carries the small labels and controls.
// Both were checked with fontTools for every Vietnamese letter and ä ö ü Ä Ö Ü ß ẞ.
export const sourceSerif = Source_Serif_4({
  variable: "--font-lm-serif",
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  display: "swap",
});
export const beVietnam = Be_Vietnam_Pro({
  variable: "--font-lm-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "600"],
  display: "swap",
});

export const memorialFontVars = [sourceSerif, beVietnam].map((f) => f.variable).join(" ");
