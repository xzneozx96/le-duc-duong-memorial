import type { Metadata } from "next";
import type { ReactNode } from "react";
import { labGuard } from "@/components/lab/lab-guard";

// Each lab page also calls labGuard() and applies its own font variables (_lab/fonts.ts).
export const metadata: Metadata = {
  title: "Lab: memorial",
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  labGuard();
  return children;
}
