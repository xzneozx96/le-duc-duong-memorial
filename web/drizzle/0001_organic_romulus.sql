ALTER TABLE "entries" ADD COLUMN "request_id" uuid;--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_request_id_unique" UNIQUE("request_id");