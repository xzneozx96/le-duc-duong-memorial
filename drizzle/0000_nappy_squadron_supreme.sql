CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"relation" text NOT NULL,
	"cls" text,
	"year" text,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"hidden_note" text
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entry_id" uuid,
	"position" integer DEFAULT 0 NOT NULL,
	"caption" text,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"display_key" text NOT NULL,
	"thumb_key" text NOT NULL,
	"bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_entry_id_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entries_visible_created_idx" ON "entries" USING btree ("hidden","created_at");--> statement-breakpoint
CREATE INDEX "photos_entry_idx" ON "photos" USING btree ("entry_id","position");