DROP INDEX "announcements_published_idx";--> statement-breakpoint
DROP INDEX "announcements_event_idx";--> statement-breakpoint
DROP INDEX "announcements_expires_idx";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "event_at";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "is_published";--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "published_at";--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ALTER COLUMN "image_public_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "announcements_type_idx" ON "announcements" ("type");--> statement-breakpoint
CREATE INDEX "announcements_created_at_idx" ON "announcements" ("created_at");