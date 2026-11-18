// Content for the client demo (/lab/memorial/demo).
// UI strings are the "Voice and microcopy" table of EXPERIENCE.md. Station paragraphs come from
// the life-story PDF timeline as samples; captions and visitor entries are samples too, and every
// caption carries a visible sample mark. The family rewrites all of them.
import { tribute } from "@/components/lab/tribute";
import type { Lang } from "../content";

export type { Lang };
type Two = Record<Lang, string>;

export type Photo = {
  src: string;
  w: number;
  h: number;
  /** object-position for cropped frames, so faces stay in the frame */
  pos?: string;
  caption: Two;
  credit?: Two;
};

export type Station = {
  id: string;
  /** which country the station is in, shown as a small tag */
  land: "vn" | "de";
  years: string;
  /** the chapter title of this part of his life (documentary heading) */
  chapter: Two;
  vi: string;
  de: string;
  text: Two;
  /** small or portrait originals shown beside the text at their own size, never enlarged */
  aside?: { photos: Photo[]; ratio: string; maxW: number; caption?: Two };
  /** one photo across the whole screen */
  lead?: { photo: Photo; wideRatio: string; widePos: string };
  clip?: { poster: string; src: string; w: number; h: number; caption: Two; credit?: Two };
  /** the last sentence of the story, set large as his own account */
  pull?: Two;
  /** the other photos: "pair" two to a row, "wall" at their own proportions */
  sheet: Photo[];
  sheetKind?: "pair" | "wall";
};

const MARK: Two = { vi: " (chú thích mẫu)", de: " (Beispieltext)" };
const cap = (vi: string, de: string): Two => ({ vi: vi + MARK.vi, de: de + MARK.de });
const img = (name: string, w: number, h: number, vi: string, de: string, pos?: string): Photo => ({
  src: `/demo/${name}.jpg`,
  w,
  h,
  pos,
  caption: cap(vi, de),
});

export const FAMILY_EMAIL = "giadinh@example.com";

export const person = {
  name: "Lê Đức Dương",
  years: "1942–2026",
  born: "01.05.1942",
  died: "11.11.2026",
  /** cut out of the studio portrait's solid backdrop, so he can stand in front of the page's own panel */
  portrait: { src: "/demo/portrait-cutout.webp", w: 1024, h: 1535 },
};

// The posters are family photos of him speaking at reunions, not frames of the films; the note
// under the films says so.
export const films = [
  {
    id: "K4gtri_cHB8",
    title: "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG",
    lang: "de",
    date: "06.09.2020",
    part: { vi: "Phần I", de: "Teil I" },
    poster: { src: "/demo/germany-14.jpg", w: 754, h: 960, pos: "50% 40%" },
  },
  {
    id: "otEfBuw2AoE",
    title: "Talk with the former “Moritzburger” Lê Đức Dương",
    lang: "en",
    date: "13.09.2020",
    part: { vi: "Phần II", de: "Teil II" },
    poster: { src: "/demo/germany-9.jpg", w: 1200, h: 1600, pos: "50% 30%" },
  },
] as const;

const group = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const size = (bytes: number) => (bytes / 1_000_000).toFixed(1).replace(".", ",");

export const ui = {
  vi: {
    labBar: "Bản thử: chú thích ảnh là mẫu, gia đình sẽ viết lại.",
    labHome: "Về trang lab",
    portraitAlt: "Chân dung Nhà giáo Lê Đức Dương",
    honorific: "Nhà giáo",
    title: "Một ánh Dương còn mãi",
    intro: "Đi tàu sang Đức năm 1955, dạy tiếng Đức ở Thanh Xuân 1970–1988.",
    jumpLabel: "Các phần của trang",
    jump: { film: "Thước phim", journey: "Cuộc đời", book: "Lưu bút" },
    filmHeading: "Thước phim cuộc đời",
    filmLine: "Hai cuộc trò chuyện ghi lại năm 2020 trong podcast «Sống chung với Corona» của TS. Trương Hồng Quang, nơi thầy kể lại hành trình từ chuyến tàu năm 1955 đến những năm đứng lớp tiếng Đức.",
    filmPlay: "Xem phim",
    filmNote: "Phim mở từ YouTube khi bạn bấm xem.",
    filmPhotos: "Ảnh trên hai phim: thầy nói chuyện trong các buổi gặp mặt học trò cũ (chú thích mẫu).",
    journeyHeading: "Một đời gieo chữ",
    journeyLine: "Hành trình của một nhà giáo giữa hai miền đất, Việt Nam và nước Đức, từ cậu bé làng quê Hà Nam đến người thầy của nhiều thế hệ lưu học sinh.",
    pullCite: "Lời thầy kể, podcast «Sống chung với Corona», 2020",
    lands: { vn: "Việt Nam", de: "Đức" },
    farewell: { died: "Thầy mất ngày 11.11.2026.", funeral: "Lễ tang ngày 27.11.2026." },
    morePhotos: (n: number) => `Xem thêm ${n} ảnh`,
    fewerPhotos: "Thu gọn ảnh",
    clipPlay: "Xem đoạn phim 58 giây",
    viewer: {
      close: "Đóng",
      prev: "Ảnh trước",
      next: "Ảnh sau",
      count: (i: number, n: number) => `Ảnh ${i}/${n}`,
    },
    bookHeading: "Lưu bút",
    bookKicker: "Lời tri ân và tưởng nhớ",
    bookTrack: "Các lời lưu bút",
    bookPrev: "Lưu bút trước",
    bookNext: "Lưu bút sau",
    bookCount: (i: number, n: number) => `${i} / ${n}`,
    bookInvite: "Học trò, đồng nghiệp và bạn bè của thầy, xin gửi lại đôi dòng tưởng nhớ. Mỗi lời lưu bút là một phần ký ức về thầy, được giữ lại cho các thế hệ sau. Bạn không cần tài khoản.",
    bookOpen: "Viết lưu bút",
    formClose: "Đóng biểu mẫu",
    formCloseNote: "(những gì bạn đã viết vẫn được giữ)",
    readAll: "Đọc hết bài",
    collapse: "Thu gọn bài",
    sentOn: (d: string) => `Gửi ngày ${d}`,
    moreEntries: (n: number) => `Xem thêm ${n} bài`,
    entryPhoto: (i: number, name: string) => `Ảnh ${i} của ${name}`,
    justSent: "Vừa gửi",
    posted: "Đã gửi lưu bút. Lưu bút của bạn hiện ngay dưới đây.",
    relation: { student: "Học trò", colleague: "Đồng nghiệp", friend: "Bạn bè", family: "Gia đình", other: "Khác" },
    form: {
      name: "Tên của bạn",
      relation: "Quan hệ với thầy",
      cls: "Lớp hoặc khóa (nếu có)",
      clsHint: "Ví dụ: lớp tiếng Đức khóa 1974",
      clsField: "Lớp hoặc khóa",
      year: "Năm (nếu có)",
      yearHint: "Ví dụ: 1975 hoặc 1975–1979",
      yearField: "Năm",
      message: "Lời lưu bút",
      messageHint: "Bạn có thể viết bằng tiếng Việt hay tiếng Đức. Lưu bút hiện đúng như bạn viết, không dịch.",
      photos: "Ảnh (nếu có)",
      photosHint: "Mỗi ảnh tối đa 5 MB. Ảnh hiện công khai cùng lưu bút.",
      pick: "Chọn ảnh",
      remove: "Bỏ ảnh",
      removeNamed: (file: string) => `Bỏ ảnh ${file}`,
      added: (n: number) => `${n} ảnh đã được thêm`,
      privacy: (email: string) =>
        `Lưu bút và ảnh của bạn hiện công khai trên trang này. Trang lưu tên, quan hệ, lớp, năm, lời lưu bút, ảnh và ngày gửi, không lưu email hay số điện thoại. Nếu bạn muốn gỡ lưu bút, xin viết cho gia đình: ${email}.`,
      send: "Gửi lưu bút",
      sending: "Đang gửi…",
      sendingPhoto: (i: number, n: number) => `Đang gửi ảnh ${i}/${n}…`,
      manyPhotos: (n: number) => `${n} ảnh có thể cần vài phút trên mạng điện thoại.`,
      summary: (n: number) => `Chưa gửi. Bạn cần sửa ${n} mục, ghi chú ở ngay dưới từng mục.`,
      nameMissing: "Xin bạn ghi tên để mọi người biết ai viết.",
      relationMissing: "Xin bạn chọn một mục. Nếu không mục nào đúng, xin chọn Khác.",
      messageMissing: "Xin bạn viết vài dòng trước khi gửi.",
      tooLong: (field: string, count: number, limit: number) =>
        `${field} dài ${group(count)} ký tự, tối đa ${group(limit)}. Xin bạn bớt ${group(count - limit)} ký tự.`,
      counter: (count: number, limit: number) => `${group(count)}/${group(limit)} ký tự`,
      notPhoto: (file: string) =>
        `“${file}” không phải ảnh nên chưa được thêm. Chỉ nhận ảnh (JPG, PNG, HEIC…), mỗi ảnh tối đa 5 MB.`,
      tooBig: (file: string, bytes: number) =>
        `“${file}” nặng ${size(bytes)} MB, quá mức 5 MB nên chưa được thêm. Các ảnh khác vẫn giữ nguyên. Cách làm nhỏ ảnh: bạn gửi ảnh qua Zalo hoặc WhatsApp cho chính mình rồi lưu bản nhận được, bản này thường nhỏ hơn 5 MB.`,
    },
    footerHeading: "Tư liệu & nguồn",
    family: (email: string) => `Trang tưởng niệm Nhà giáo Lê Đức Dương, do gia đình thực hiện năm 2026. Liên hệ: ${email}`,
    toTop: "Lên đầu trang",
    newTab: "(mở trong thẻ mới)",
    sources: [
      "Podcast «Sống chung với Corona», kỳ 17 (06.09.2020): Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG",
      "Podcast «Sống chung với Corona», kỳ 18 (13.09.2020): Talk with the former “Moritzburger” Lê Đức Dương",
      "Der Spiegel: bài về các em nhỏ Việt Nam ở CHDC Đức",
      "VietnamPlus (TTXVN): bài về cựu học sinh trường Moritzburg",
      "Blog của TS. Trương Hồng Quang",
    ],
  },
  de: {
    labBar:
      "Entwurf: Die Bildunterschriften sind Beispiele, die Familie schreibt sie neu.",
    labHome: "Zur Lab-Übersicht",
    portraitAlt: "Porträt von Lê Đức Dương",
    title: "Ein Sonnenstrahl, der bleibt",
    honorific: "Lehrer",
    intro: "1955 mit dem Zug in die DDR, 1970 bis 1988 Deutschlehrer in Hanoi.",
    jumpLabel: "Abschnitte der Seite",
    jump: { film: "Film", journey: "Lebensweg", book: "Gästebuch" },
    filmHeading: "Zwei Gespräche aus dem Jahr 2020",
    filmLine: "Im Podcast «Sống chung với Corona» von Trương Hồng Quang erzählt er aus seinem Leben.",
    filmPlay: "Film ansehen",
    filmNote: "Der Film lädt erst von YouTube, wenn Sie ihn starten.",
    filmPhotos: "Fotos auf den Filmen: Er spricht bei Treffen mit früheren Schülern (Beispieltext).",
    journeyHeading: "Sein Lebensweg",
    journeyLine: "Der Weg eines Lehrers zwischen Vietnam und Deutschland.",
    pullCite: "Wie er erzählte, Podcast «Sống chung với Corona», 2020",
    lands: { vn: "Vietnam", de: "Deutschland" },
    farewell: { died: "Er ist am 11.11.2026 gestorben.", funeral: "Die Trauerfeier ist am 27.11.2026." },
    morePhotos: (n: number) => (n === 1 ? "1 weiteres Foto zeigen" : `${n} weitere Fotos zeigen`),
    fewerPhotos: "Weniger Fotos zeigen",
    clipPlay: "58-Sekunden-Film abspielen",
    viewer: {
      close: "Schließen",
      prev: "Voriges Foto",
      next: "Nächstes Foto",
      count: (i: number, n: number) => `Foto ${i} von ${n}`,
    },
    bookHeading: "Gästebuch",
    bookKicker: "Dank und Erinnerung",
    bookTrack: "Die Einträge",
    bookPrev: "Voriger Eintrag",
    bookNext: "Nächster Eintrag",
    bookCount: (i: number, n: number) => `${i} / ${n}`,
    bookInvite:
      "Wer mit ihm gelernt, gearbeitet oder gelebt hat, kann sich hier ins Gästebuch eintragen. Ein Konto ist nicht nötig.",
    bookOpen: "Ins Gästebuch schreiben",
    formClose: "Formular schließen",
    formCloseNote: "(Ihr Text bleibt erhalten)",
    readAll: "Ganzen Eintrag lesen",
    collapse: "Eintrag einklappen",
    sentOn: (d: string) => `Eingetragen am ${d}`,
    moreEntries: (n: number) => (n === 1 ? "1 weiteren Eintrag zeigen" : `${n} weitere Einträge zeigen`),
    entryPhoto: (i: number, name: string) => `Foto ${i} von ${name}`,
    justSent: "Gerade eingetragen",
    posted: "Ihr Eintrag steht jetzt im Gästebuch.",
    relation: { student: "Schüler/in", colleague: "Kollege/Kollegin", friend: "Freund/in", family: "Familie", other: "Andere" },
    form: {
      name: "Ihr Name",
      relation: "Ihre Verbindung zu ihm",
      cls: "Klasse oder Jahrgang (freiwillig)",
      clsHint: "Zum Beispiel: Deutschkurs 1974",
      clsField: "Klasse oder Jahrgang",
      year: "Jahr (freiwillig)",
      yearHint: "Zum Beispiel 1975 oder 1975–1979",
      yearField: "Jahr",
      message: "Ihr Eintrag",
      messageHint: "Auf Deutsch oder Vietnamesisch. Er erscheint so, wie Sie ihn schreiben, ohne Übersetzung.",
      photos: "Fotos (freiwillig)",
      photosHint: "Höchstens 5 MB pro Foto. Die Fotos sind mit dem Eintrag öffentlich.",
      pick: "Fotos auswählen",
      remove: "Entfernen",
      removeNamed: (file: string) => `${file} entfernen`,
      added: (n: number) => (n === 1 ? "1 Foto hinzugefügt" : `${n} Fotos hinzugefügt`),
      privacy: (email: string) =>
        `Eintrag und Fotos sind auf dieser Seite öffentlich. Gespeichert werden Name, Verbindung, Klasse, Jahr, Text, Fotos und Datum, keine E-Mail-Adresse und keine Telefonnummer. Wenn ein Eintrag entfernt werden soll, schreiben Sie der Familie: ${email}.`,
      send: "Eintragen",
      sending: "Wird eingetragen …",
      sendingPhoto: (i: number, n: number) => `Foto ${i} von ${n} wird gesendet …`,
      manyPhotos: (n: number) => `${n} Fotos können über Mobilfunk einige Minuten dauern.`,
      summary: (n: number) =>
        n === 1
          ? "Noch nicht eingetragen. 1 Angabe fehlt oder ist zu lang, der Hinweis steht beim Feld."
          : `Noch nicht eingetragen. ${n} Angaben fehlen oder sind zu lang, die Hinweise stehen bei den Feldern.`,
      nameMissing: "Bitte geben Sie Ihren Namen an, damit man weiß, wer schreibt.",
      relationMissing: "Bitte wählen Sie eine Angabe. Wenn keine passt, wählen Sie Andere.",
      messageMissing: "Bitte schreiben Sie ein paar Zeilen, bevor Sie eintragen.",
      tooLong: (field: string, count: number, limit: number) =>
        `${field} hat ${group(count)} Zeichen, erlaubt sind ${group(limit)}. Bitte kürzen Sie um ${group(count - limit)} Zeichen.`,
      counter: (count: number, limit: number) => `${group(count)}/${group(limit)} Zeichen`,
      notPhoto: (file: string) =>
        `„${file}“ ist kein Foto und wurde nicht hinzugefügt. Nur Fotos (JPG, PNG, HEIC …), höchstens 5 MB pro Foto.`,
      tooBig: (file: string, bytes: number) =>
        `„${file}“ ist ${size(bytes)} MB groß, erlaubt sind 5 MB. Es wurde nicht hinzugefügt, die anderen Fotos bleiben. So wird es kleiner: Schicken Sie es sich selbst per WhatsApp und speichern Sie die empfangene Kopie, sie ist meist kleiner als 5 MB.`,
    },
    footerHeading: "Quellen",
    family: (email: string) => `Eine Seite der Familie von Lê Đức Dương, 2026. Kontakt: ${email}`,
    toTop: "Nach oben",
    newTab: "(öffnet in neuem Tab)",
    sources: [
      "Podcast «Sống chung với Corona», Folge 17 (06.09.2020): Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG",
      "Podcast «Sống chung với Corona», Folge 18 (13.09.2020): Talk with the former “Moritzburger” Lê Đức Dương",
      "Der Spiegel: Artikel über vietnamesische Kinder in der DDR",
      "VietnamPlus (TTXVN): Artikel über ehemalige Moritzburger Schüler",
      "Blog von Dr. Trương Hồng Quang",
    ],
  },
} as const;

export type Strings = (typeof ui)[Lang];

export const sourceLinks = [
  "https://youtu.be/K4gtri_cHB8",
  "https://youtu.be/otEfBuw2AoE",
  "https://www.spiegel.de/geschichte/vietnamesische-kinder-in-der-ddr-ein-paradies-bis-zur-wende-a-1060680.html",
  "https://www.vietnamplus.vn/ky-uc-dep-cua-cuu-hoc-sinh-truong-moritzburg-hai-lan-duoc-gap-bac-ho-post790681.vnp",
  "https://drtruong.wordpress.com/",
] as const;

export const stations: Station[] = [
  {
    id: "ha-nam",
    chapter: { vi: "Tuổi thơ và chuyến tàu năm 1955", de: "Kindheit und der Zug von 1955" },
    land: "vn",
    years: "1942–1955",
    vi: "Hà Nam, Việt Nam",
    de: "Hà Nam, Vietnam",
    text: {
      vi: "Thầy sinh ngày 01.05.1942 và lớn lên ở vùng quê Hà Nam. Cuối tháng 8.1955, sau ba tháng tập trung ở trường Chu Văn An, thầy cùng đoàn 150 em nhỏ lên tàu ở ga Hàng Cỏ.",
      de: "Er wurde am 01.05.1942 geboren und wuchs auf dem Land in Hà Nam auf. Ende August 1955 stieg er nach drei Monaten an der Chu-Văn-An-Schule mit einer Gruppe von 150 Kindern am Bahnhof Hàng Cỏ in den Zug.",
    },
    sheet: [],
  },
  {
    id: "moritzburg",
    chapter: { vi: "Học tiếng Đức từ con số không", de: "Deutsch von null an" },
    land: "de",
    years: "1955–1959",
    vi: "Moritzburg, CHDC Đức",
    de: "Moritzburg, DDR",
    text: {
      vi: "Ngày 23.9.1955, đoàn đến CHDC Đức và vào Käthe-Kollwitz-Heim ở Moritzburg. Các em học tiếng Đức từ con số không, mọi môn đều học thẳng bằng tiếng Đức. Thầy kể rằng năm 1957 Bác Hồ đến thăm trường.",
      de: "Am 23.9.1955 kam die Gruppe in der DDR an und zog ins Käthe-Kollwitz-Heim in Moritzburg. Die Kinder lernten Deutsch von null an; alle Fächer wurden direkt auf Deutsch unterrichtet. Er erzählte, dass Hồ Chí Minh die Schule 1957 besuchte.",
    },
    lead: {
      photo: img("moritzburg-1", 1532, 1021, "Các em xếp hàng đi trước nhà trường ở Moritzburg.", "Die Kinder ziehen in Reihen am Schulhaus in Moritzburg vorbei.", "62% 50%"),
      wideRatio: "2 / 1",
      widePos: "50% 88%",
    },
    // The clip with the repost's caption bar and like counter cropped away (public/demo).
    clip: {
      poster: "/demo/gap-bac-ho-clean.jpg",
      src: "/demo/gap-bac-ho-clean.mp4",
      w: 464,
      h: 294,
      caption: cap(
        "Phim tư liệu về chuyến thăm CHDC Đức của Bác Hồ năm 1957. Thầy kể về lần gặp Bác khi Bác thăm trường ở Moritzburg.",
        "Archivfilm vom Besuch Hồ Chí Minhs in der DDR 1957. Er erzählte von der Begegnung bei dessen Besuch in Moritzburg.",
      ),
    },
    sheetKind: "pair",
    sheet: [
      img("moritzburg-3", 895, 680, "Ảnh chụp chung trong tuyết trước nhà trường.", "Gruppenfoto im Schnee vor dem Schulhaus.", "50% 55%"),
      {
        ...img("moritzburg-press", 1168, 880, "Các em tặng hoa trong một buổi đón tiếp.", "Die Kinder überreichen Blumen bei einem Empfang.", "50% 40%"),
        credit: { vi: "Ảnh: TTXVN/VietnamPlus", de: "Foto: TTXVN/VietnamPlus" },
      },
      img("moritzburg-4", 1600, 1200, "Một buổi nói chuyện trong lớp học.", "Ein Gespräch im Klassenraum.", "50% 30%"),
    ],
  },
  {
    id: "radebeul",
    chapter: { vi: "Những năm học nghề", de: "Die Lehrjahre" },
    land: "de",
    years: "1959–1962",
    vi: "Radebeul và Dresden, CHDC Đức",
    de: "Radebeul und Dresden, DDR",
    text: {
      vi: "Tháng 7.1959 cả hai trường về nước. Tháng 9, thầy cùng khoảng 150 bạn quay lại Đức học nghề thợ nguội ở Radebeul và Dresden.",
      de: "Im Juli 1959 kehrten beide Schulen nach Vietnam zurück. Im September kam er mit etwa 150 anderen wieder, um in Radebeul und Dresden Schlosser zu lernen.",
    },
    aside: {
      ratio: "265 / 400",
      maxW: 265,
      caption: cap("Hai tấm ảnh trong vườn, thời học nghề ở Radebeul.", "Zwei Aufnahmen im Garten aus der Lehrzeit in Radebeul."),
      photos: [
        img("radebeul-1", 265, 400, "Trong vườn, thời học nghề ở Radebeul.", "Im Garten, während der Lehrzeit in Radebeul."),
        img("radebeul-2", 265, 400, "Một lúc vui đùa trong vườn.", "Ein heiterer Augenblick im Garten."),
      ],
    },
    sheet: [],
  },
  {
    id: "ha-noi",
    chapter: { vi: "Ban ngày đi làm, ban đêm đi học", de: "Tagsüber Arbeit, nachts Schule" },
    land: "vn",
    years: "1962–1965",
    vi: "Hà Nội, Việt Nam",
    de: "Hanoi, Vietnam",
    text: {
      vi: "Về nước, ban ngày thầy làm ở Viện Đo lường, ban đêm học bổ túc văn hóa và tốt nghiệp lớp 10.",
      de: "Zurück in Hanoi arbeitete er tagsüber am Institut für Messwesen, lernte nachts weiter und schloss die 10. Klasse ab.",
    },
    sheet: [],
  },
  {
    id: "magdeburg",
    chapter: { vi: "Giảng đường Magdeburg", de: "Studium in Magdeburg" },
    land: "de",
    years: "1965–1970",
    vi: "Magdeburg, CHDC Đức",
    de: "Magdeburg, DDR",
    text: {
      vi: "Lần thứ ba sang Đức, thầy học đại học tại TH Magdeburg và tốt nghiệp kỹ sư (Diplom-Ingenieur) ngành cơ khí chế tạo máy.",
      de: "Zum dritten Mal in der DDR studierte er an der TH Magdeburg und schloss als Diplom-Ingenieur für Maschinenbau ab.",
    },
    aside: {
      ratio: "4 / 5",
      maxW: 440,
      photos: [img("magdeburg-1", 900, 1600, "Thầy thời sinh viên ở Magdeburg.", "Als Student in Magdeburg.", "50% 0%")],
    },
    sheet: [],
  },
  {
    id: "thanh-xuan",
    chapter: { vi: "Mười tám năm đứng lớp", de: "Achtzehn Jahre vor der Klasse" },
    land: "vn",
    years: "1970–1988",
    vi: "Thanh Xuân, Hà Nội",
    de: "Thanh Xuân, Hanoi",
    text: {
      vi: "Thầy dạy tiếng Đức ở trường Đại học Ngoại ngữ và đi phiên dịch. Năm 1975–1976, thầy học thêm sư phạm tiếng Đức một năm ở Leipzig.",
      de: "Er unterrichtete Deutsch an der Fremdsprachenhochschule und dolmetschte. 1975–1976 studierte er ein Jahr Deutschdidaktik in Leipzig.",
    },
    pull: {
      vi: "Thầy kể mình là giáo viên rất nghiêm khắc, và gần như mọi thế hệ lưu học sinh đi Đức thời ấy đều qua lớp thầy.",
      de: "Er erzählte, er sei ein sehr strenger Lehrer gewesen, und fast jeder Jahrgang, der damals zum Studium in die DDR ging, sei durch seine Klasse gegangen.",
    },
    sheetKind: "pair",
    sheet: [
      img("thanhxuan-1", 1024, 768, "Thầy cùng gia đình.", "Mit seiner Familie.", "50% 40%"),
      img("thanhxuan-2", 720, 535, "Một tấm ảnh chụp chung thời ấy.", "Ein Gruppenfoto aus jener Zeit."),
    ],
  },
  {
    id: "germany",
    chapter: { vi: "Trở lại nước Đức", de: "Zurück in Deutschland" },
    land: "de",
    years: "1988–2026",
    vi: "Nước Đức",
    de: "Deutschland",
    text: {
      vi: "Ngày 22.12.1988, thầy trở lại Đức. Năm 2005, nhân 50 năm ngày sang Đức, thầy tự về thăm Moritzburg, và giúp đoàn bạn cũ từ Việt Nam tìm mộ ba người bạn ở nghĩa trang Dresden. Năm 2015, thầy cùng chị Võ Cẩm Trang trả lời phỏng vấn tờ Spiegel.",
      de: "Am 22.12.1988 kehrte er in die DDR zurück. 2005, zum 50. Jahrestag der Ankunft, fuhr er selbst nach Moritzburg und half den alten Freunden aus Vietnam, die Gräber von drei Kameraden auf dem Dresdner Friedhof zu finden. 2015 gab er gemeinsam mit Võ Cẩm Trang dem Spiegel ein Interview.",
    },
    lead: {
      photo: img("germany-1", 1280, 960, "Gặp mặt học trò cũ ở Moritzburg.", "Treffen mit früheren Schülern in Moritzburg."),
      wideRatio: "21 / 9",
      widePos: "50% 96%",
    },
    sheetKind: "wall",
    sheet: [
      img("germany-2", 960, 642, "Trên thuyền ở Spreewald.", "Auf dem Kahn im Spreewald."),
      img("germany-3", 768, 1024, "Trước nhà, cùng chú chó.", "Vor dem Haus, mit dem Hund.", "50% 8%"),
      img("germany-4", 960, 1280, "Cùng các học trò nữ trong áo dài.", "Mit früheren Schülerinnen im Áo dài.", "50% 40%"),
      img("germany-5", 768, 1024, "Trên bậc thềm, cùng gia đình và các chú chó.", "Auf der Treppe, mit Familie und Hunden.", "50% 44%"),
      img("germany-6", 768, 1024, "Thầy và chú chó trắng.", "Mit dem weißen Hund.", "50% 22%"),
      img("germany-7", 960, 720, "Đoàn thuyền ở Spreewald.", "Die Kähne im Spreewald.", "50% 60%"),
      img("germany-8", 768, 1024, "Bế chú chó trong sân.", "Mit dem Hund auf dem Arm im Hof.", "50% 40%"),
      img("germany-9", 1200, 1600, "Thầy phát biểu trong buổi gặp mặt.", "Er spricht beim Treffen.", "50% 45%"),
      img("germany-10", 768, 1024, "Giáng sinh ở nhà.", "Weihnachten zu Hause.", "50% 22%"),
      img("germany-11", 768, 1024, "Giáng sinh, cùng chú chó nhỏ.", "Weihnachten, mit dem kleinen Hund.", "50% 18%"),
      img("germany-12", 1024, 768, "Một buổi trưa nắng ở quán.", "Ein sonniger Mittag im Lokal.", "50% 55%"),
      img("germany-13", 1024, 768, "Cả nhà trước cửa.", "Die Familie vor der Haustür.", "50% 50%"),
      img("germany-14", 754, 960, "Thầy kể chuyện ngày xưa.", "Er erzählt von früher.", "50% 46%"),
      img("germany-15", 768, 1024, "Ở bàn ăn, cùng chú chó nhỏ.", "Am Esstisch, mit dem kleinen Hund.", "50% 24%"),
      img("germany-16", 768, 1024, "Bữa trưa cùng học trò cũ.", "Mittagessen mit früheren Schülern.", "50% 90%"),
    ],
  },
];

/** The timeline's last part: the family's photo of him walking away down a tree-lined street. */
export const farewellPhoto: Photo = img(
  "farewell-walk",
  1200,
  1600,
  "Thầy những năm cuối ở Đức.",
  "In seinen letzten Jahren in Deutschland.",
  "50% 60%",
);

export type Relation = keyof (typeof ui)["vi"]["relation"];

export type Entry = {
  id: string;
  name: string;
  relation: Relation;
  cls?: string;
  year?: string;
  date: string;
  /** the text's own language, when it is known (the tribute); visitor entries carry none */
  lang?: Lang;
  text: string;
  photos?: { src: string; w?: number; h?: number; pos?: string }[];
  justSent?: boolean;
};

export const tributeEntry: Entry = {
  id: "tribute",
  name: "Cao Hữu Ngạn",
  relation: "colleague",
  date: "18.11.2026",
  lang: "vi",
  text: tribute.join("\n\n"),
};

// Sample visitor entries, newest first. Not real people; the lab bar says so.
// MOCK ENTRIES for previewing the Lưu bút layout only. They are invented, not real memories:
// remove them (back to an empty array) before the site goes live.
const ph = (name: string, w: number, h: number, pos?: string) => ({ src: `/demo/${name}.jpg`, w, h, pos });
export const sampleEntries: Entry[] = [
  {
    id: "mock-1",
    name: "Nguyễn Thị Thu Hà",
    relation: "student",
    cls: "Lớp D3",
    year: "1978–1979",
    date: "19.11.2026",
    text:
      "Kính gửi thầy,\n\nEm vào lớp tiếng Đức của thầy năm 1978, khi cả lớp chưa ai biết nói một câu cho tròn. Buổi đầu tiên thầy bước vào đúng giờ, không sớm một phút, không muộn một phút, đặt chiếc cặp lên bàn và nói bằng tiếng Đức. Cả lớp ngơ ngác, còn thầy thì cứ kiên nhẫn chỉ vào từng đồ vật trong phòng mà gọi tên.\n\nThầy nghiêm lắm. Ai làm bài thiếu, thầy không mắng, chỉ nhìn rồi bảo: «Ngày mai em đọc lại cho tôi nghe.» Vậy mà đứa nào cũng sợ hơn bị mắng. Nhờ những ngày ấy mà sang Đức em không bỡ ngỡ, nghe giảng được ngay từ học kỳ đầu.\n\nGần năm mươi năm rồi, em vẫn giữ quyển vở chép tay có những dòng thầy sửa bằng mực đỏ. Em xin thắp một nén nhang từ xa, cầu mong thầy yên nghỉ.",
    photos: [ph("thanhxuan-2", 720, 535)],
  },
  {
    id: "mock-2",
    name: "Trần Quang Vinh",
    relation: "student",
    cls: "Lớp D7",
    year: "1983–1984",
    date: "19.11.2026",
    text:
      "Thưa thầy,\n\nChúng em là lứa sinh viên đi Đức cuối những năm tám mươi. Ký túc xá Thanh Xuân hồi ấy mất điện thường xuyên, tối nào cả phòng cũng ngồi quanh ngọn đèn dầu ôn từ vựng thầy giao. Có hôm thầy đi ngang, thấy chúng em đọc sai trọng âm, thầy dừng lại sửa từng chữ, rồi mới về.\n\nSau này gặp lại thầy ở Đức, thầy vẫn nhớ tên gần hết lớp, nhớ cả đứa hay ngủ gật ở bàn cuối. Thầy cười to, kể chuyện ngày xưa, kể chuyện những chuyến phiên dịch toát mồ hôi. Chúng em ngồi nghe mà như được trở lại lớp học năm nào.\n\nCảm ơn thầy vì đã mở cho chúng em cánh cửa sang một đất nước khác, một cuộc đời khác.",
    photos: [ph("germany-1", 1280, 960), ph("germany-13", 1024, 768), ph("germany-7", 960, 720)],
  },
  {
    id: "mock-3",
    name: "Gabriele Hoffmann",
    relation: "colleague",
    cls: "Dolmetscherin",
    year: "1990–2010",
    date: "20.11.2026",
    text:
      "Lieber Herr Dương,\n\nwir haben uns Anfang der neunziger Jahre bei einer Übersetzung für eine vietnamesische Delegation kennengelernt. Ich war jung und unsicher, Sie waren ruhig, genau und immer pünktlich, auf die Minute. Wenn ich ein Wort nicht fand, haben Sie es mir leise zugeflüstert, ohne dass jemand es merkte.\n\nIn all den Jahren danach habe ich viel von Ihnen gelernt: wie man zwischen zwei Sprachen und zwei Ländern vermittelt, ohne eines davon zu verlieren. Ihr Lachen werde ich nicht vergessen.\n\nIn stiller Dankbarkeit, Ihre Gabriele",
  },
  {
    id: "mock-4",
    name: "Lê Minh Châu",
    relation: "family",
    date: "20.11.2026",
    text:
      "Ông ơi,\n\nCháu lớn lên ở Đức, tiếng Việt của cháu không giỏi bằng tiếng Đức, vậy mà ông chưa bao giờ trách. Mỗi lần cháu về thăm, ông lại kiên nhẫn dạy cháu đọc từng câu thơ, như ông đã dạy bao nhiêu thế hệ học trò đọc tiếng Đức.\n\nCháu nhớ những buổi chiều ông dắt chó đi dạo quanh khu phố, gặp ai cũng chào, ai cũng biết ông. Cháu nhớ ông kể chuyện chuyến tàu năm 1955, chuyện những người bạn nhỏ ở Moritzburg. Ngày ấy cháu nghe như nghe chuyện cổ tích.\n\nGiờ cháu mới hiểu, đó là cả một đời người. Cháu sẽ giữ những câu chuyện ấy, và kể lại cho các em cháu sau này.",
    photos: [ph("germany-3", 768, 1024), ph("germany-6", 768, 1024)],
  },
  {
    id: "mock-5",
    name: "Phạm Đức Long",
    relation: "colleague",
    cls: "Khoa tiếng Đức",
    year: "1975–1988",
    date: "21.11.2026",
    text:
      "Anh Dương kính mến,\n\nNhững năm đầu ở Thanh Xuân, cả tổ chỉ hơn mười người, chưa ai được đào tạo sư phạm bài bản. Anh là người đi học thêm ở Leipzig về, mang theo bao nhiêu giáo trình, cách soạn bài, cách ra đề, rồi chia sẻ hết cho anh em.\n\nAnh nghiêm với sinh viên nhưng rất thương. Có những em không đạt, phải ở lại, anh là người buồn nhất. Có những buổi tối anh ngồi chấm bài đến khuya dưới ánh đèn dầu, sáng hôm sau vẫn có mặt ở lớp trước giờ.\n\nAnh đi rồi, nhưng những lứa học trò anh dạy vẫn còn đó, ở khắp Việt Nam và nước Đức. Đó là điều anh để lại lớn nhất.",
    photos: [ph("thanhxuan-1", 1024, 768)],
  },
  {
    id: "mock-6",
    name: "Hoàng Thị Lan",
    relation: "student",
    cls: "Lớp D1",
    year: "1986–1987",
    date: "21.11.2026",
    text:
      "Thầy ơi,\n\nCon chỉ học thầy một năm, nhưng đó là năm con nhớ nhất thời sinh viên. Thầy dạy chúng con không chỉ tiếng Đức mà cả cách sống ở một đất nước xa lạ: đúng giờ, giữ lời, tự lo cho mình. Những điều tưởng nhỏ ấy theo con suốt những năm học ở Dresden.\n\nNăm 2019, cả lớp hẹn gặp lại thầy ở công viên Moritzburg. Thầy đến sớm nhất, đứng chờ dưới gốc cây, vẫn dáng thẳng và nụ cười hiền như ngày nào. Chúng con chụp chung một tấm ảnh, ai cũng tóc đã bạc.\n\nCon xin gửi lại tấm ảnh ấy ở đây, để thầy và chúng con còn mãi bên nhau.",
    photos: [ph("germany-2", 960, 642), ph("germany-4", 960, 1280), ph("germany-12", 1024, 768), ph("germany-8", 768, 1024)],
  },
];

/** Visitor entries shown before the "Xem thêm" button. The product shows 20; the demo has six. */
export const FIRST_BATCH = 4;

export const LIMITS = { name: 100, cls: 50, year: 50, message: 5000, counterFrom: 4500, photoBytes: 5_000_000 } as const;
