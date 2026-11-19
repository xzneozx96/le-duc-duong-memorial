import { Archivo_Narrow, Bricolage_Grotesque, Lexend, Literata, Spectral } from "next/font/google";

// Faces for the three round-1 directions. Each was glyph-checked with fontTools for every
// Vietnamese letter and ä ö ü Ä Ö Ü ß ẞ (ux.md, Lab). The vietnamese subset is required (AC-5).
export const literata = Literata({ variable: "--font-lab-literata", subsets: ["latin", "latin-ext", "vietnamese"], style: ["normal", "italic"], display: "swap" });
export const spectral = Spectral({ variable: "--font-lab-spectral", subsets: ["latin", "latin-ext", "vietnamese"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap" });
export const archivoNarrow = Archivo_Narrow({ variable: "--font-lab-archivo-narrow", subsets: ["latin", "latin-ext", "vietnamese"], weight: ["500", "600", "700"], display: "swap" });
export const bricolage = Bricolage_Grotesque({ variable: "--font-lab-bricolage", subsets: ["latin", "latin-ext", "vietnamese"], display: "swap" });
export const lexend = Lexend({ variable: "--font-lab-lexend", subsets: ["latin", "latin-ext", "vietnamese"], display: "swap" });

export const fontVars = [literata, spectral, archivoNarrow, bricolage, lexend].map((f) => f.variable).join(" ");
