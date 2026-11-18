import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { OptionC } from "../../_lab/book/c";
import { LabShell } from "../../_lab/book/parts";
import "../../_lab/book/book.css";

export const metadata: Metadata = {
  title: "Lưu bút C: Lời kể (lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <LabShell
      letter="C"
      name="Lời kể"
      note={
        <>
          <h2>Option C: the reading room</h2>
          <p>
            <strong>Idea.</strong> The book reads like a documentary in chapters, one letter per chapter, always in full. On a
            computer the screen is split: the writer&apos;s photos fill the left half and stay in view while the letter is read on
            the right, and they change as the reader moves through the letter. The tribute, which has no photo, shows its own
            title there; a letter without photos shows its own first words.
          </p>
          <p>
            <strong>Reading.</strong> The most comfortable of the five for long letters: nothing to open or close, 22 px text in a
            32em column, the name set large at the start of each chapter. A line under the invitation names every writer, each name
            a link to their chapter. On a phone each chapter opens with the writer&apos;s first photo across the screen and the
            others fall between the paragraphs.
          </p>
          <p>
            <strong>Writing.</strong> &quot;Viết lưu bút&quot; opens a blank chapter at the top (&quot;Kính gửi thầy,&quot; where
            the photo would be). Once sent it becomes a chapter of its own, right after the tribute, marked &quot;Vừa gửi&quot;.
          </p>
          <p>
            <strong>Motion.</strong> Names rise line by line from behind a mask; the photo on the left settles from a slow zoom and
            cross-fades to the next as you read. Reduced motion: still photos that still change with the reading, and small
            thumbnails to open any photo.
          </p>
          <p>
            <strong>Trade-offs.</strong> It is a long page by design: every letter is printed in full, so with hundreds of letters
            &quot;Xem thêm&quot; after 20 chapters matters. Closest to a classic layout of the five; its strength is reading, not
            surprise.
          </p>
        </>
      }
    >
      <OptionC />
    </LabShell>
  );
}
