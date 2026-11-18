import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { demoFontVars } from "../../_lab/demo/fonts";
import { OptionD3 } from "../../_lab/hero/option-d3";

export const metadata: Metadata = {
  title: "Hero D3 · Nhà giáo Lê Đức Dương (bản thử)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <div className={demoFontVars}>
      <OptionD3 />
    </div>
  );
}
