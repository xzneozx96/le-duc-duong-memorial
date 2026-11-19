import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { demoFontVars } from "../../_lab/demo/fonts";
import { OptionE1 } from "../../_lab/hero/option-e1";

export const metadata: Metadata = {
  title: "Hero E1 · Nhà giáo Lê Đức Dương (bản thử)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <div className={demoFontVars}>
      <OptionE1 />
    </div>
  );
}
