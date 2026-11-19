import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { demoFontVars } from "../../_lab/demo/fonts";
import { OptionE4 } from "../../_lab/hero/option-e4";

export const metadata: Metadata = {
  title: "Hero E4 · Nhà giáo Lê Đức Dương (bản thử)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <div className={demoFontVars}>
      <OptionE4 />
    </div>
  );
}
