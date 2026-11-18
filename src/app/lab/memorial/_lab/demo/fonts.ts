import { Be_Vietnam_Pro, Cormorant, Lora } from "next/font/google";

// Faces of the demo (v3, after the Farewell reference): Cormorant for display, Lora for reading,
// Be Vietnam Pro for labels and controls in place of Jost, which has no Vietnamese letters.
// Each file was checked with fontTools for every Vietnamese letter and ä ö ü Ä Ö Ü ß ẞ.
export const cormorant = Cormorant({ variable: "--font-lm-display", subsets: ["latin", "latin-ext", "vietnamese"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });
export const lora = Lora({ variable: "--font-lm-body", subsets: ["latin", "latin-ext", "vietnamese"], weight: ["400", "500", "600"], style: ["normal", "italic"], display: "swap" });
export const beVietnam = Be_Vietnam_Pro({ variable: "--font-lm-label", subsets: ["latin", "latin-ext", "vietnamese"], weight: ["500", "600", "700"], display: "swap" });

export const demoFontVars = [cormorant, lora, beVietnam].map((f) => f.variable).join(" ");
