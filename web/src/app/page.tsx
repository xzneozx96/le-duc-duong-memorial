import type { Metadata } from "next";
import { DemoPage } from "./lab/memorial/_lab/demo/demo-page";

// The approved memorial page (owner, 18.11.2026) is the site's home. It still lives in the lab
// folder while the backend is wired in; it moves to its own product folder after that.
export const metadata: Metadata = {
  title: "Nhà giáo Lê Đức Dương (01.05.1942 – 11.11.2026)",
  description:
    "Trang tưởng nhớ Nhà giáo Lê Đức Dương, người thầy tiếng Đức của nhiều thế hệ lưu học sinh Việt Nam: cuộc đời, những thước phim và lưu bút của học trò, đồng nghiệp, bạn bè.",
};

export default function Home() {
  return <DemoPage />;
}
