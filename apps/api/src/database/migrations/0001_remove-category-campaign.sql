ALTER TABLE "campaign_type" DROP COLUMN "category";--> statement-breakpoint
DROP TYPE "public"."campaign_category";--> statement-breakpoint
UPDATE "module" SET "name" = 'Expenses' WHERE "id" = 14;--> statement-breakpoint
UPDATE "module" SET "name" = 'Revenues' WHERE "id" = 15;
