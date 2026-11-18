import type { Metadata } from "next";
import { labGuard } from "@/components/lab/lab-guard";
import { OptionE } from "../../_lab/book/e";
import { LabShell } from "../../_lab/book/parts";
import "../../_lab/book/book.css";

export const metadata: Metadata = {
  title: "Lưu bút E: Mặt sau tấm ảnh (lab)",
  robots: { index: false, follow: false },
};

export default function Page() {
  labGuard();
  return (
    <LabShell
      letter="E"
      name="Mặt sau tấm ảnh"
      note={
        <>
          <h2>Option E: the back of the photograph</h2>
          <p>
            <strong>Idea.</strong> People have always written on the back of a photo. After the tribute, printed in full, the book
            is a warm wall of prints hung salon-style, each with a small museum label (name, relation, how many photos). A letter
            sent with photos hangs as its first photo with the others stacked behind it; a letter without photos hangs as a card
            showing its own first words (&quot;Lieber Herr Dương,&quot;).
          </p>
          <p>
            <strong>Reading.</strong> Pressing a print takes it off the wall and turns it over: the letter is on the back, on a
            large paper card over the darkened room (22 px, full width of the card, nothing clipped). The photos sit at the foot of
            the back as &quot;Mặt trước&quot; and open full screen. &quot;Tấm sau&quot; turns the next print over;
            &quot;Treo lại lên tường&quot; (or Escape) hangs it back.
          </p>
          <p>
            <strong>Writing.</strong> &quot;Viết lưu bút&quot; brings a blank card: you write on its back, and the first photo you
            choose will be its front. Once sent, the new print is hung on the wall, first in the row, with its &quot;Vừa gửi&quot;
            label.
          </p>
          <p>
            <strong>Motion.</strong> The prints are hung one after another as the wall comes into view, each settling at its own
            slight angle; a print turns edge-on and comes round to its back when opened. Reduced motion: the back simply appears.
          </p>
          <p>
            <strong>Trade-offs.</strong> The most photo-led option: the wall is beautiful when many people send photos, plainer when
            most send only words. Reading happens over the page (in a full-screen card), not in the page itself. With hundreds of
            letters the wall hangs 20, then &quot;Xem thêm&quot;.
          </p>
        </>
      }
    >
      <OptionE />
    </LabShell>
  );
}
