import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { OptionA } from "../../_lab/book/a";
import { LabShell } from "../../_lab/book/parts";
import "../../_lab/book/book.css";

export const metadata: Metadata = {
  title: "Lưu bút A: Thư gửi thầy (lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <LabShell
      letter="A"
      name="Thư gửi thầy"
      note={
        <>
          <h2>Option A: letters to him</h2>
          <p>
            <strong>Idea.</strong> Every memory is a letter addressed to him, in an airmail envelope (he lived between Hà Nội and
            Germany), stamped with the writer&apos;s own first photo and postmarked with the day it was sent. One letter lies open on
            the desk at a time; the tribute is open when you arrive.
          </p>
          <p>
            <strong>Reading.</strong> The open sheet is a wide, quiet page (22 px, 33em measure), photos sent with it lie under the
            text as prints. &quot;Thư sau&quot; at the foot of each letter leads straight on to the next, so nobody has to go back to
            the tray.
          </p>
          <p>
            <strong>Writing.</strong> &quot;Viết lưu bút&quot; turns the sheet into a blank letter that already begins &quot;Kính gửi
            thầy Lê Đức Dương,&quot;: the message comes first, who wrote it after. On sending, the sheet folds in three and drops
            away, the new envelope lands on top of the tray and the postmark is stamped on it.
          </p>
          <p>
            <strong>Trade-offs.</strong> On a phone the tray sits under the open letter; a reader who wants to pick by name scrolls
            past the letter first (the &quot;Thư sau&quot; link covers reading in order). With hundreds of letters the tray shows 20,
            then &quot;Xem thêm&quot;.
          </p>
        </>
      }
    >
      <OptionA />
    </LabShell>
  );
}
