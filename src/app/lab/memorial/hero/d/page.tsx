import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { demoFontVars } from "../../_lab/demo/fonts";
import { OptionD } from "../../_lab/hero/option-d";

export const metadata: Metadata = {
  title: "Hero D · Nhà giáo Lê Đức Dương (bản thử)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <div className={demoFontVars}>
      <OptionD />
    </div>
  );
}
