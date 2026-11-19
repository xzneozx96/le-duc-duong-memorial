import { describe, expect, it } from "vitest";
import { parseEntryInput } from "./validation";

const PHOTO = "3f2b8c1e-5d4a-4b6f-9a1e-0c7d2e8f9a10";
const valid = { name: "Nguyễn Văn A", relation: "student", message: "Thầy dạy em tiếng Đức." };

function errorsOf(raw: unknown) {
  const r = parseEntryInput(raw);
  if (r.ok) throw new Error("expected validation to fail");
  return r.errors;
}

describe("parseEntryInput", () => {
  it("accepts the minimum valid entry and fills the optional fields with null and no photos", () => {
    const r = parseEntryInput(valid);
    expect(r).toEqual({
      ok: true,
      value: { ...valid, cls: null, year: null, photos: [], requestId: null },
    });
  });

  it.each([
    ["name", { ...valid, name: undefined }],
    ["name", { ...valid, name: "   " }],
    ["relation", { ...valid, relation: undefined }],
    ["message", { ...valid, message: undefined }],
    ["message", { ...valid, message: " \n\t " }],
  ])("reports %s as required when missing or blank", (field, raw) => {
    expect(errorsOf(raw)).toEqual({ [field]: "required" });
  });

  it("reports an unknown relation as invalid", () => {
    expect(errorsOf({ ...valid, relation: "neighbour" })).toEqual({ relation: "invalid" });
  });

  it("reports several fields at once", () => {
    expect(errorsOf({ relation: "x" })).toEqual({
      name: "required",
      relation: "invalid",
      message: "required",
    });
  });

  it("accepts a name of exactly 100 characters and refuses 101", () => {
    expect(parseEntryInput({ ...valid, name: "a".repeat(100) }).ok).toBe(true);
    expect(errorsOf({ ...valid, name: "a".repeat(101) })).toEqual({ name: "tooLong" });
  });

  it("accepts a message of exactly 5000 characters and refuses 5001", () => {
    expect(parseEntryInput({ ...valid, message: "a".repeat(5000) }).ok).toBe(true);
    expect(errorsOf({ ...valid, message: "a".repeat(5001) })).toEqual({ message: "tooLong" });
  });

  it("accepts class and year of exactly 50 characters and refuses 51", () => {
    expect(parseEntryInput({ ...valid, cls: "a".repeat(50), year: "b".repeat(50) }).ok).toBe(true);
    expect(errorsOf({ ...valid, cls: "a".repeat(51) })).toEqual({ cls: "tooLong" });
    expect(errorsOf({ ...valid, year: "b".repeat(51) })).toEqual({ year: "tooLong" });
  });

  it("counts a decomposed Vietnamese string by what a person reads, after NFC", () => {
    // 100 x "ệ" typed as e + dot below + circumflex (3 code points each) is 100 characters after NFC.
    const decomposed = "ệ".repeat(100);
    const r = parseEntryInput({ ...valid, name: decomposed });
    expect(r.ok && r.value.name).toBe("ệ".repeat(100));
    expect(errorsOf({ ...valid, name: decomposed + "ệ" })).toEqual({ name: "tooLong" });
  });

  it("counts an emoji as one code point, not two UTF-16 units", () => {
    expect(parseEntryInput({ ...valid, name: "😀".repeat(100) }).ok).toBe(true);
    expect(errorsOf({ ...valid, name: "😀".repeat(101) })).toEqual({ name: "tooLong" });
  });

  it("trims strings and turns blank optional fields into null", () => {
    const r = parseEntryInput({ ...valid, name: "  An  ", cls: "   ", year: "", message: "\n hi \n" });
    expect(r).toEqual({
      ok: true,
      value: { name: "An", relation: "student", cls: null, year: null, message: "hi", photos: [], requestId: null },
    });
  });

  it("collapses two or more blank lines (three or more newlines) in the message to exactly one blank line", () => {
    const r = parseEntryInput({ ...valid, message: "a\n\n\n\nb\n\nc\r\n\r\n\r\nd" });
    expect(r.ok && r.value.message).toBe("a\n\nb\n\nc\n\nd");
  });

  it("keeps photo ids in order with captions trimmed and blank captions as null", () => {
    const other = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";
    const r = parseEntryInput({
      ...valid,
      photos: [{ id: PHOTO, caption: "  Lớp D3  " }, { id: other, caption: " " }, { id: other.replace("9", "8") }],
    });
    expect(r.ok && r.value.photos).toEqual([
      { id: PHOTO, caption: "Lớp D3" },
      { id: other, caption: null },
      { id: other.replace("9", "8"), caption: null },
    ]);
  });

  it("refuses a photo id that is not a uuid, a caption over 140, and a repeated id", () => {
    expect(errorsOf({ ...valid, photos: [{ id: "nope" }] })).toEqual({ photos: "invalid" });
    expect(errorsOf({ ...valid, photos: [{ id: PHOTO, caption: "a".repeat(141) }] })).toEqual({ photos: "tooLong" });
    expect(parseEntryInput({ ...valid, photos: [{ id: PHOTO, caption: "a".repeat(140) }] }).ok).toBe(true);
    expect(errorsOf({ ...valid, photos: [{ id: PHOTO }, { id: PHOTO }] })).toEqual({ photos: "invalid" });
    expect(errorsOf({ ...valid, photos: "x" })).toEqual({ photos: "invalid" });
  });

  it("refuses a body that is not an object, and non-string fields", () => {
    expect(errorsOf(null)).toEqual({ name: "required", relation: "required", message: "required" });
    expect(errorsOf({ ...valid, name: 5 })).toEqual({ name: "invalid" });
    expect(errorsOf({ ...valid, cls: 5 })).toEqual({ cls: "invalid" });
  });

  it("strips NUL and other control characters from every text field but keeps newline and tab", () => {
    const r = parseEntryInput({
      name: "A\u0000n\u0007",
      relation: "student",
      cls: "D\u00003",
      year: "19\u000178",
      message: "line1\u0000\nline\t2\u001b\u007f",
      photos: [{ id: PHOTO, caption: "ca\u0000p" }],
    });
    expect(r).toEqual({
      ok: true,
      value: {
        name: "An", relation: "student", cls: "D3", year: "1978",
        message: "line1\nline\t2", photos: [{ id: PHOTO, caption: "cap" }], requestId: null,
      },
    });
  });

  it("normalises CRLF and lone CR line breaks to newlines", () => {
    const r = parseEntryInput({ ...valid, message: "a\r\nb\rc" });
    expect(r.ok && r.value.message).toBe("a\nb\nc");
  });

  it("treats a field that is only control characters as missing, and counts length after stripping", () => {
    expect(errorsOf({ ...valid, name: "\u0000\u0001" })).toEqual({ name: "required" });
    expect(errorsOf({ ...valid, message: "\u0000 \u0000" })).toEqual({ message: "required" });
    expect(parseEntryInput({ ...valid, cls: "\u0000", name: "a\u0000".repeat(100) })).toMatchObject({ ok: true, value: { cls: null } });
  });

  it("keeps a valid requestId (lower-cased), treats a blank one as none, and refuses a malformed one", () => {
    const r = parseEntryInput({ ...valid, requestId: PHOTO.toUpperCase() });
    expect(r.ok && r.value.requestId).toBe(PHOTO);
    const blank = parseEntryInput({ ...valid, requestId: "" });
    expect(blank.ok && blank.value.requestId).toBeNull();
    expect(errorsOf({ ...valid, requestId: "nope" })).toEqual({ requestId: "invalid" });
    expect(errorsOf({ ...valid, requestId: 7 })).toEqual({ requestId: "invalid" });
  });
});
