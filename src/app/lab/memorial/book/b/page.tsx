import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { OptionB } from "../../_lab/book/b";
import { LabShell } from "../../_lab/book/parts";
import "../../_lab/book/book.css";

export const metadata: Metadata = {
  title: "Lưu bút B: Đèn hoa đăng (lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <LabShell
      letter="B"
      name="Đèn hoa đăng"
      note={
        <>
          <h2>Option B: lanterns on the river</h2>
          <p>
            <strong>Idea.</strong> In Vietnam people set paper lotus lanterns (đèn hoa đăng) on the water to remember the dead.
            After the tribute, which is printed in full on paper, the book becomes a dusk river: each memory is one lantern carrying
            the writer&apos;s name. Most memorable of the five, and the most Vietnamese.
          </p>
          <p>
            <strong>Reading.</strong> Pressing a lantern lifts its letter out of the river in place: a paper page lit from above by
            the lantern, photos first (the first one large), then the letter at 22 px. &quot;Ngọn đèn sau&quot; reads on;
            &quot;Trở lại dòng sông&quot; returns to the same lantern. Long text never sits on the dark.
          </p>
          <p>
            <strong>Writing.</strong> The form opens on paper under the invitation and says that a lantern will be set on the
            river. On sending, the page goes to the river and a new lantern rises from the water and lights up, marked
            &quot;Vừa gửi&quot;.
          </p>
          <p>
            <strong>Motion.</strong> Lanterns drift in from upstream and their lights come up one by one; afterwards they only
            breathe and flicker (the drawing moves, the button never does). Reduced motion: still lanterns, still water.
          </p>
          <p>
            <strong>Trade-offs.</strong> The tribute comes before the river, so the lanterns start about one long letter down.
            Names on the river are light on dark (14:1). With hundreds of letters the river shows 20 lanterns, then &quot;Xem
            thêm&quot;; the river gets long but stays calm. The drawing is a new illustration that needs the family&apos;s eye.
          </p>
        </>
      }
    >
      <OptionB />
    </LabShell>
  );
}
