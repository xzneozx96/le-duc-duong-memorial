// Lab content for round 1. Strings follow EXPERIENCE.md (Voice and microcopy).
// Station paragraphs, intro and captions are samples: the family has not written them yet,
// so every caption carries a visible sample mark.
import { tribute } from "@/components/lab/tribute";

export type Lang = "vi" | "de";

export type Photo = {
  src: string;
  w: number;
  h: number;
  archive?: boolean;
  caption: Record<Lang, string>;
  credit?: Record<Lang, string>;
};

export type Station = {
  id: string;
  years: string;
  vi: string;
  de: string;
  text: Record<Lang, string>;
  clip?: { poster: string; src: string; w: number; h: number; caption: Record<Lang, string>; button: Record<Lang, string> };
  photos: Photo[];
};

const sample = { vi: " (chú thích mẫu)", de: " (Beispieltext)" };
const cap = (vi: string, de: string) => ({ vi: vi + sample.vi, de: de + sample.de });

export const person = {
  name: "Lê Đức Dương",
  years: "1942–2026",
  portrait: { src: "/lab/portrait.jpg", w: 801, h: 1200 },
};

export const ui = {
  vi: {
    langGroup: "Ngôn ngữ",
    title: "Một ánh Dương còn mãi",
    intro:
      "Từ ga Hàng Cỏ năm 1955 đến lớp tiếng Đức ở Thanh Xuân, 1970–1988.",
    jump: { film: "Phim", journey: "Hành trình", book: "Lưu bút" },
    filmHeading: "Thầy kể",
    films: [
      { title: "Talk with the former “Moritzburger” Lê Đức Dương", length: "Phần I" },
      { title: "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG", length: "Phần II" },
    ],
    play: "Xem phim",
    filmNote: "Phim mở từ YouTube khi bạn bấm xem.",
    journeyHeading: "Hành trình của thầy",
    morePhotos: (n: number) => `Xem thêm ${n} ảnh`,
    bookHeading: "Lưu bút",
    bookInvite:
      "Bạn từng học, làm việc hay sống cùng thầy? Xin bạn viết vài dòng nhớ về thầy. Bạn không cần tài khoản.",
    bookOpen: "Viết lưu bút",
    readAll: "Đọc hết bài",
    collapse: "Thu gọn",
    sentOn: (d: string) => `Gửi ngày ${d}`,
    moreEntries: (n: number) => `Xem thêm ${n} bài`,
    relation: { student: "Học trò", colleague: "Đồng nghiệp" },
    sampleNote: "Bản thử: đoạn văn, chú thích và một lưu bút là mẫu, gia đình chưa viết.",
  },
  de: {
    langGroup: "Sprache",
    title: "Ein Sonnenstrahl, der bleibt",
    intro:
      "Vom Bahnhof Hàng Cỏ 1955 zum Deutschunterricht in Hanoi, 1970–1988.",
    jump: { film: "Film", journey: "Lebensweg", book: "Gästebuch" },
    filmHeading: "Er erzählt",
    films: [
      { title: "Talk with the former “Moritzburger” Lê Đức Dương", length: "Teil I" },
      { title: "Gespräch mit dem Deutschlehrer LÊ ĐỨC DƯƠNG", length: "Teil II" },
    ],
    play: "Film ansehen",
    filmNote: "Der Film lädt erst von YouTube, wenn Sie ihn starten.",
    journeyHeading: "Sein Lebensweg",
    morePhotos: (n: number) => `${n} weitere Fotos zeigen`,
    bookHeading: "Gästebuch",
    bookInvite:
      "Haben Sie mit ihm gelernt, gearbeitet oder gelebt? Schreiben Sie ein paar Zeilen über ihn. Ein Konto ist nicht nötig.",
    bookOpen: "Ins Gästebuch schreiben",
    readAll: "Ganzen Eintrag lesen",
    collapse: "Einklappen",
    sentOn: (d: string) => `Eingetragen am ${d}`,
    moreEntries: (n: number) => `${n} weitere Einträge zeigen`,
    relation: { student: "Schüler", colleague: "Kollege" },
    sampleNote: "Entwurf: Absätze, Bildunterschriften und ein Eintrag sind Beispiele, die Familie hat sie noch nicht geschrieben.",
  },
} as const;

export const stations: Station[] = [
  {
    id: "moritzburg",
    years: "1955–1959",
    vi: "Moritzburg, CHDC Đức",
    de: "Moritzburg, DDR",
    text: {
      vi: "Năm 1955, thầy là một trong 150 em nhỏ rời ga Hàng Cỏ sang CHDC Đức. Các em sống ở Käthe-Kollwitz-Heim tại Moritzburg, học tiếng Đức từ những câu đầu tiên. Thầy kể rằng Bác Hồ từng đến thăm các em ở đó.",
      de: "1955 gehörte er zu den 150 Kindern, die am Bahnhof Hàng Cỏ in den Zug in die DDR stiegen. Sie lebten im Käthe-Kollwitz-Heim in Moritzburg und lernten Deutsch vom ersten Satz an. Er erzählte, dass Hồ Chí Minh sie dort besucht habe.",
    },
    clip: {
      poster: "/lab/gap-bac-ho-poster.jpg",
      src: "/lab/gap-bac-ho.mp4",
      w: 1000,
      h: 1034,
      caption: cap(
        "Thầy kể về lần gặp Bác Hồ khi Bác thăm Moritzburg năm 1957.",
        "Er erzählt von der Begegnung mit Hồ Chí Minh in Moritzburg 1957.",
      ),
      button: { vi: "Xem đoạn phim 58 giây", de: "58-Sekunden-Film abspielen" },
    },
    photos: [
      { src: "/lab/train.jpg", w: 1200, h: 800, archive: true, caption: cap("Các em nhỏ trước Käthe-Kollwitz-Heim, Moritzburg.", "Die Kinder vor dem Käthe-Kollwitz-Heim, Moritzburg.") },
      { src: "/lab/moritz-group.jpg", w: 895, h: 680, archive: true, caption: cap("Ảnh chụp chung mùa đông ở Moritzburg.", "Gruppenfoto im Winter in Moritzburg.") },
      {
        src: "/lab/press-flowers.jpg",
        w: 1168,
        h: 880,
        archive: true,
        caption: cap("Các em tặng hoa trong một buổi đón tiếp.", "Die Kinder überreichen Blumen bei einem Empfang."),
        credit: { vi: "Ảnh: TTXVN/VietnamPlus", de: "Foto: TTXVN/VietnamPlus" },
      },
    ],
  },
  {
    id: "germany",
    years: "1988–2026",
    vi: "Nước Đức",
    de: "Deutschland",
    text: {
      vi: "Ngày 22.12.1988, thầy trở lại Đức. Thầy làm phiên dịch và gắn bó với cộng đồng người Việt. Những năm sau, học trò cũ khắp nơi hẹn gặp thầy ở Moritzburg, ở Spreewald, và thầy vẫn là người đến đúng giờ nhất.",
      de: "Am 22.12.1988 kehrte er nach Deutschland zurück. Er arbeitete als Dolmetscher und blieb der vietnamesischen Gemeinschaft eng verbunden. Später trafen ihn seine früheren Schüler in Moritzburg und im Spreewald, und er war immer als Erster pünktlich da.",
    },
    photos: [
      { src: "/lab/de-park-group.jpg", w: 1280, h: 960, caption: cap("Gặp mặt học trò cũ ở công viên Moritzburg.", "Treffen ehemaliger Schüler im Park von Moritzburg.") },
      { src: "/lab/de-spreewald-laugh.jpg", w: 960, h: 642, caption: cap("Trên thuyền ở Spreewald.", "Auf dem Kahn im Spreewald.") },
      { src: "/lab/de-aodai.jpg", w: 960, h: 1280, caption: cap("Cùng các học trò nữ trong áo dài.", "Mit ehemaligen Schülerinnen im Áo dài.") },
      { src: "/lab/de-spreewald-boats.jpg", w: 960, h: 720, caption: cap("Đoàn thuyền ở Lübbenau.", "Die Kähne in Lübbenau.") },
      { src: "/lab/de-speaking.jpg", w: 1200, h: 1600, caption: cap("Thầy phát biểu trong buổi gặp mặt.", "Er spricht beim Treffen.") },
      { src: "/lab/de-mic.jpg", w: 754, h: 960, caption: cap("Thầy kể chuyện ngày xưa.", "Er erzählt von früher.") },
    ],
  },
];

export const entries = [
  {
    name: "Cao Hữu Ngạn",
    relation: "colleague" as const,
    date: "18.11.2026",
    lang: "vi" as Lang,
    paragraphs: tribute,
  },
  {
    name: "Hans-Joachim Schäfer-Brückner",
    relation: "student" as const,
    cls: "Deutschkurs 1974",
    year: "1975–1979",
    date: "18.11.2026",
    lang: "de" as Lang,
    // Worst-case fixture: markup must show as typed, never rendered or escaped twice.
    paragraphs: [
      "Lieber Thầy,",
      "ich denke heute an Ihren Unterricht in Hà Nội. Ich war 1974 in Ihrem Deutschkurs, und Ihr erster Satz an der Tafel war „Guten Morgen, wir beginnen pünktlich.“",
      "Fotos von unserem Kurs: https://photos.example.org/album/deutschkurs-1974-hanoi-thanh-xuan-lop-tieng-duc-thay-duong-2026",
      "<b>Danke</b> &amp; auf Wiedersehen",
    ],
  },
];
