import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    relation: text("relation").notNull(),
    cls: text("cls"),
    year: text("year"),
    message: text("message").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    hidden: boolean("hidden").notNull().default(false),
    hiddenNote: text("hidden_note"),
  },
  (t) => [index("entries_visible_created_idx").on(t.hidden, t.createdAt)],
);

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** null while staged (uploaded, not yet attached to a post) */
    entryId: uuid("entry_id").references(() => entries.id),
    position: integer("position").notNull().default(0),
    caption: text("caption"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    displayKey: text("display_key").notNull(),
    thumbKey: text("thumb_key").notNull(),
    bytes: integer("bytes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("photos_entry_idx").on(t.entryId, t.position)],
);

export type EntryRow = typeof entries.$inferSelect;
export type PhotoRow = typeof photos.$inferSelect;
