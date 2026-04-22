ALTER TABLE "appointment_reminder" ADD COLUMN "procedure_id" integer;--> statement-breakpoint
ALTER TABLE "appointment_reminder" ADD CONSTRAINT "appointment_reminder_procedure_id_clinical_procedure_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."clinical_procedure"("id") ON DELETE set null ON UPDATE no action;
