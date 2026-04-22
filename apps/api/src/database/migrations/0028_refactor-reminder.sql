CREATE TYPE "public"."reminder_entity_type" AS ENUM('appointment', 'procedure', 'financial_transaction', 'campaign');--> statement-breakpoint
ALTER TABLE "appointment_reminder" RENAME TO "reminder";--> statement-breakpoint
ALTER TABLE "reminder" DROP CONSTRAINT "appointment_reminder_appointment_id_appointment_id_fk";
--> statement-breakpoint
ALTER TABLE "reminder" DROP CONSTRAINT "appointment_reminder_procedure_id_clinical_procedure_id_fk";
--> statement-breakpoint
ALTER TABLE "reminder" DROP CONSTRAINT "appointment_reminder_employee_id_employee_id_fk";
--> statement-breakpoint
DROP INDEX "appointment_reminder_employee_id_created_at_index";--> statement-breakpoint
ALTER TABLE "reminder" ADD COLUMN "entity_type" "reminder_entity_type";--> statement-breakpoint
ALTER TABLE "reminder" ADD COLUMN "entity_id" integer;--> statement-breakpoint
UPDATE "reminder" SET "entity_type" = 'appointment', "entity_id" = "appointment_id" WHERE "appointment_id" IS NOT NULL;--> statement-breakpoint
UPDATE "reminder" SET "entity_type" = 'procedure', "entity_id" = "procedure_id" WHERE "procedure_id" IS NOT NULL AND "entity_type" IS NULL;--> statement-breakpoint
DELETE FROM "reminder" WHERE "entity_type" IS NULL OR "entity_id" IS NULL;--> statement-breakpoint
ALTER TABLE "reminder" ALTER COLUMN "entity_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reminder" ALTER COLUMN "entity_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "employee_id" integer;--> statement-breakpoint
UPDATE "campaign" SET "employee_id" = (SELECT MIN(id) FROM "employee") WHERE "employee_id" IS NULL AND EXISTS (SELECT 1 FROM "employee");--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "campaign" WHERE "employee_id" IS NULL) THEN
    ALTER TABLE "campaign" ALTER COLUMN "employee_id" SET NOT NULL;
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "reminder" ADD CONSTRAINT "reminder_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reminder_employee_id_created_at_index" ON "reminder" USING btree ("employee_id","created_at");--> statement-breakpoint
CREATE INDEX "reminder_entity_type_entity_id_index" ON "reminder" USING btree ("entity_type","entity_id");--> statement-breakpoint
ALTER TABLE "reminder" DROP COLUMN "appointment_id";--> statement-breakpoint
ALTER TABLE "reminder" DROP COLUMN "procedure_id";
