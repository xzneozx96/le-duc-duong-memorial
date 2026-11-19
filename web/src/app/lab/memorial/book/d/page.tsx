import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { OptionD } from "../../_lab/book/d";
import { LabShell } from "../../_lab/book/parts";
import "../../_lab/book/book.css";

export const metadata: Metadata = {
  title: "Lưu bút D: Những năm tháng (lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <LabShell
      letter="D"
      name="Những năm tháng"
      note={
        <>
          <h2>Option D: the years beside him</h2>
          <p>
            <strong>Idea.</strong> The book is laid along his life, from the train to Germany in 1955 to 2026. Each letter hangs at
            the year its writer gave (&quot;1978–1979&quot; hangs at 1978), so the Thanh Xuân years fill with his students and the
            later years with colleagues and friends in Germany. The shape of the names is the shape of his teaching life. Letters
            with no year wait under the line, in &quot;Không ghi năm&quot;.
          </p>
          <p>
            <strong>Reading.</strong> A name opens its letter on paper under the band, its year set large in bronze beside the
            writer&apos;s name; the photos stand in a column beside the text on a computer and under it on a phone. &quot;Năm
            trước&quot; and &quot;Năm sau&quot; read on in the order of the years; &quot;Về dòng thời gian&quot; goes back up.
          </p>
          <p>
            <strong>Writing.</strong> The form asks for the year as before, now with a reason: &quot;lá thư của bạn sẽ nằm ở đúng
            năm ấy&quot;. Once sent, the new name drops onto the line at its year and its letter opens below.
          </p>
          <p>
            <strong>Motion.</strong> The line draws itself from 1955 to 2026, the Thanh Xuân years light up, then the threads grow
            and the names rise at their years. Reduced motion: the band is simply there.
          </p>
          <p>
            <strong>Trade-offs.</strong> The most informative and the least intimate. It repeats the idea of the life line higher
            on the page. With hundreds of letters the busy years need grouping (for example &quot;1978: 14 lá thư&quot; opening that
            year&apos;s names); this demo stacks names in lanes, which suits a few dozen. The tribute&apos;s year (1977) is taken
            from its own text, since it has no year field.
          </p>
        </>
      }
    >
      <OptionD />
    </LabShell>
  );
}
