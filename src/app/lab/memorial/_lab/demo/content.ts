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
  /** which homeland the stop is in: the route map weaves between the two */
  land: "vn" | "de";
  years: string;
  vi: string;
  de: string;
  text: Two;
  /** small or portrait originals shown beside the text at their own size, never enlarged */
  aside?: { photos: Photo[]; ratio: string; maxW: number; caption?: Two };
  /** one photo across the whole screen */
  lead?: { photo: Photo; wideRatio: string; widePos: string };
  clip?: { poster: string; src: string; w: number; h: number; caption: Two };
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
  portrait: { src: "/demo/portrait.jpg", w: 1024, h: 1535 },
};

export const films = [
  { id: "K4gtri_cHB8", title: "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG", part: { vi: "Phần I", de: "Teil I" } },
  { id: "otEfBuw2AoE", title: "Talk with the former “Moritzburger” Lê Đức Dương", part: { vi: "Phần II", de: "Teil II" } },
] as const;

const group = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const size = (bytes: number) => (bytes / 1_000_000).toFixed(1).replace(".", ",");

export const ui = {
  vi: {
    labBar: "Bản thử: đoạn văn, chú thích và các lưu bút của khách là mẫu, gia đình chưa viết.",
    labHome: "Về trang lab",
    title: "Một ánh Dương còn mãi",
    intro: "Đi tàu sang Đức năm 1955, dạy tiếng Đức ở Thanh Xuân 1970–1988.",
    jumpLabel: "Các phần của trang",
    jump: { film: "Phim", journey: "Hành trình", book: "Lưu bút" },
    filmHeading: "Hai buổi trò chuyện năm 2020",
    filmLine: "Trong podcast «Sống chung với Corona» của Trương Hồng Quang, thầy kể về cuộc đời mình.",
    filmPlay: "Xem phim",
    filmNote: "Phim mở từ YouTube khi bạn bấm xem.",
    journeyHeading: "Hành trình của thầy",
    lands: { vn: "Việt Nam", de: "Đức" },
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
    bookInvite: "Ai từng học, làm việc hay sống cùng thầy đều có thể viết lưu bút ở đây. Bạn không cần tài khoản.",
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
    family: (email: string) => `Trang do gia đình thầy Lê Đức Dương lập năm 2026. Liên hệ: ${email}`,
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
      "Entwurf: Absätze, Bildunterschriften und die Gästebucheinträge der Besucher sind Beispiele, die Familie hat sie noch nicht geschrieben.",
    labHome: "Zur Lab-Übersicht",
    title: "Ein Sonnenstrahl, der bleibt",
    intro: "1955 mit dem Zug in die DDR, 1970 bis 1988 Deutschlehrer in Hanoi.",
    jumpLabel: "Abschnitte der Seite",
    jump: { film: "Film", journey: "Lebensweg", book: "Gästebuch" },
    filmHeading: "Zwei Gespräche aus dem Jahr 2020",
    filmLine: "Im Podcast «Sống chung với Corona» von Trương Hồng Quang erzählt er aus seinem Leben.",
    filmPlay: "Film ansehen",
    filmNote: "Der Film lädt erst von YouTube, wenn Sie ihn starten.",
    journeyHeading: "Sein Lebensweg",
    lands: { vn: "Vietnam", de: "Deutschland" },
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
    land: "vn",
    years: "1942–1955",
    vi: "Hà Nam, Việt Nam",
    de: "Hà Nam, Vietnam",
    text: {
      vi: "Thầy sinh ngày 01.05.1942 và lớn lên ở vùng quê Hà Nam. Mùa hè 1955, thầy cùng 150 em nhỏ tập trung ba tháng ở trường Chu Văn An, rồi lên tàu ở ga Hàng Cỏ.",
      de: "Er wurde am 01.05.1942 geboren und wuchs auf dem Land in Hà Nam auf. Im Sommer 1955 verbrachte er mit 150 Kindern drei Monate an der Chu-Văn-An-Schule, dann stiegen sie am Bahnhof Hàng Cỏ in den Zug.",
    },
    sheet: [],
  },
  {
    id: "moritzburg",
    land: "de",
    years: "1955–1959",
    vi: "Moritzburg, CHDC Đức",
    de: "Moritzburg, DDR",
    text: {
      vi: "Ngày 23.9.1955, đoàn đến CHDC Đức và vào Käthe-Kollwitz-Heim ở Moritzburg. Các em học tiếng Đức từ những câu đầu tiên. Thầy kể rằng năm 1957 Bác Hồ đến thăm trường.",
      de: "Am 23.9.1955 kam die Gruppe in der DDR an und zog ins Käthe-Kollwitz-Heim in Moritzburg. Die Kinder lernten Deutsch vom ersten Satz an. Er erzählte, dass Hồ Chí Minh die Schule 1957 besuchte.",
    },
    lead: {
      photo: img("moritzburg-1", 1532, 1021, "Các em xếp hàng đi trước nhà trường ở Moritzburg.", "Die Kinder ziehen in Reihen am Schulhaus in Moritzburg vorbei.", "62% 50%"),
      wideRatio: "2 / 1",
      widePos: "50% 88%",
    },
    clip: {
      poster: "/demo/gap-bac-ho-poster.jpg",
      src: "/demo/gap-bac-ho.mp4",
      w: 1000,
      h: 1034,
      caption: cap(
        "Thầy kể về lần gặp Bác Hồ khi Bác thăm trường ở Moritzburg năm 1957.",
        "Er erzählte von der Begegnung mit Hồ Chí Minh bei dessen Besuch in Moritzburg 1957.",
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
    land: "de",
    years: "1959–1962",
    vi: "Radebeul và Dresden, CHDC Đức",
    de: "Radebeul und Dresden, DDR",
    text: {
      vi: "Tháng 7.1959 cả trường về nước. Tháng 9, thầy cùng khoảng 150 bạn quay lại Đức học nghề thợ nguội ở Radebeul và Dresden.",
      de: "Im Juli 1959 kehrte die Schule nach Vietnam zurück. Im September kam er mit etwa 150 anderen wieder, um in Radebeul und Dresden Schlosser zu lernen.",
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
    land: "vn",
    years: "1962–1965",
    vi: "Hà Nội, Việt Nam",
    de: "Hanoi, Vietnam",
    text: {
      vi: "Về nước, thầy làm ở Viện Đo lường, buổi tối học bổ túc văn hóa và tốt nghiệp lớp 10.",
      de: "Zurück in Hanoi arbeitete er am Institut für Messwesen, lernte abends weiter und schloss die 10. Klasse ab.",
    },
    sheet: [],
  },
  {
    id: "magdeburg",
    land: "de",
    years: "1965–1970",
    vi: "Magdeburg, CHDC Đức",
    de: "Magdeburg, DDR",
    text: {
      vi: "Lần thứ ba sang Đức, thầy học đại học tại TH Magdeburg và tốt nghiệp kỹ sư cơ khí.",
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
    land: "vn",
    years: "1970–1988",
    vi: "Thanh Xuân, Hà Nội",
    de: "Thanh Xuân, Hanoi",
    text: {
      vi: "Thầy dạy tiếng Đức ở trường Đại học Ngoại ngữ và đi phiên dịch. Năm 1975–1976, thầy học thêm sư phạm tiếng Đức một năm ở Leipzig. Thầy kể gần như lớp sinh viên nào sang Đức thời ấy cũng qua lớp thầy.",
      de: "Er unterrichtete Deutsch an der Fremdsprachenhochschule und dolmetschte. 1975–1976 studierte er ein Jahr Deutschdidaktik in Leipzig. Er erzählte, dass fast jeder Jahrgang, der damals in die DDR ging, bei ihm lernte.",
    },
    sheetKind: "pair",
    sheet: [
      img("thanhxuan-1", 1024, 768, "Thầy cùng gia đình.", "Mit seiner Familie.", "50% 40%"),
      img("thanhxuan-2", 720, 535, "Một tấm ảnh chụp chung thời ấy.", "Ein Gruppenfoto aus jener Zeit."),
    ],
  },
  {
    id: "germany",
    land: "de",
    years: "1988–2026",
    vi: "Nước Đức",
    de: "Deutschland",
    text: {
      vi: "Ngày 22.12.1988, thầy trở lại Đức. Năm 2005, đúng 50 năm sau ngày sang Đức, thầy tự về thăm Moritzburg. Những năm sau, học trò cũ hẹn gặp thầy ở Moritzburg và Spreewald; thầy cười nhiều bên các chú chó của mình.",
      de: "Am 22.12.1988 kehrte er in die DDR zurück. 2005, fünfzig Jahre nach der Ankunft, fuhr er selbst nach Moritzburg. Später trafen ihn seine früheren Schüler in Moritzburg und im Spreewald; zu Hause lachte er viel mit seinen Hunden.",
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
export const sampleEntries: Entry[] = [
  {
    id: "s1",
    name: "Tôn Nữ Thị Ngọc Diễm Phượng",
    relation: "student",
    cls: "Lớp tiếng Đức chuyên tu khóa 1974, Đại học Ngoại ngữ",
    year: "1974–1978",
    date: "18.11.2026",
    text: "Thưa thầy,\n\nem gửi lại mấy tấm ảnh chuyến đi Spreewald, hôm cả lớp ngồi thuyền với thầy. Thầy cười suốt buổi, còn chúng em thì tranh nhau kể chuyện lớp cũ.\n\nEm cảm ơn thầy vì những giờ tiếng Đức đầu tiên.",
    photos: [
      { src: "/demo/germany-2.jpg", w: 960, h: 642 },
      { src: "/demo/germany-7.jpg", w: 960, h: 720, pos: "50% 60%" },
      { src: "/demo/germany-16.jpg", w: 768, h: 1024, pos: "50% 90%" },
    ],
  },
  {
    id: "s2",
    name: "Hans-Joachim Schäfer-Brückner",
    relation: "colleague",
    cls: "Deutschabteilung ĐHNN",
    year: "1978–1984",
    date: "18.11.2026",
    // Worst-case fixture: markup must show exactly as typed, never rendered or escaped twice.
    text: "Lieber Herr Dương,\n\nich habe selten jemanden erlebt, der so geduldig zuhören konnte. Wenn ein Student einen Satz zum dritten Mal falsch begann, haben Sie gelächelt und gesagt: „Noch einmal, in Ruhe.“\n\nBei unserem letzten Treffen in Moritzburg haben Sie von Ihren Hunden erzählt, und wir haben lange gelacht.\n\nDanke und auf Wiedersehen",
  },
  {
    id: "s3",
    name: "Nguyễn Thị Hồng Nhung",
    relation: "student",
    cls: "Lớp tiếng Đức khóa 1974–1976",
    year: "1974–1976",
    date: "17.11.2026",
    text: "Thưa thầy,\n\nNăm 1974 em vào lớp tiếng Đức, chưa biết một chữ nào. Buổi đầu tiên thầy viết lên bảng câu “Guten Morgen” và bảo cả lớp đọc theo. Ai đọc sai thầy không trách, chỉ cười rồi đọc lại chậm hơn. Em vẫn giữ quyển vở năm ấy, trang nào cũng có chữ thầy sửa bằng mực đỏ.\n\nThầy dạy chúng em chia động từ, nhưng thầy cũng dạy chúng em đến lớp đúng giờ, viết cho ngay ngắn và hỏi lại khi chưa hiểu. Có hôm mất điện, cả lớp ngồi học bên cửa sổ, thầy kể chuyện những ngày thầy còn nhỏ ở Moritzburg, chuyện tuyết đầu mùa và những câu tiếng Đức đầu tiên thầy học được.\n\nSau này sang Đức học, em mới hiểu những giờ học ấy quý thế nào. Câu nào em nói đúng, em đều nhớ là học từ thầy.\n\nMấy năm trước gặp lại thầy trong buổi họp lớp, thầy vẫn nhớ tên từng đứa, vẫn hỏi “Na, wie geht’s?” như ngày xưa. Chúng em cứ nghĩ còn nhiều dịp gặp thầy nữa.\n\nEm kính chào thầy. Em cảm ơn thầy về tất cả.",
  },
  {
    id: "s4",
    name: "TRẦN VĂN ĐỨC",
    relation: "student",
    year: "khoảng 1980",
    date: "17.11.2026",
    text: "Kính tặng thầy,\n\nSân ga năm ấy còn sương,\nđoàn tàu chở những lên đường tuổi thơ.\nThầy đi, mang một giấc mơ,\nmang về tiếng Đức, từng giờ dạy em.",
  },
  {
    id: "s5",
    name: "Hà",
    relation: "student",
    date: "17.11.2026",
    text: "Em nhớ thầy.",
  },
  {
    id: "s6",
    name: "Familie Krüger",
    relation: "friend",
    date: "16.11.2026",
    text: "Wir denken an ihn und an sein Lachen.\nIn stiller Verbundenheit aus Dresden.",
  },
];

/** Visitor entries shown before the "Xem thêm" button. The product shows 20; the demo has six. */
export const FIRST_BATCH = 4;

export const LIMITS = { name: 100, cls: 50, year: 50, message: 5000, counterFrom: 4500, photoBytes: 5_000_000 } as const;
