import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { DemoPage } from "../_lab/demo/demo-page";

export const metadata: Metadata = {
  title: "Nhà giáo Lê Đức Dương · Một ánh Dương còn mãi (bản thử)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return <DemoPage />;
}
