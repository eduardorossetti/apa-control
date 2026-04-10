ALTER TABLE "clinical_procedure" ALTER COLUMN "actual_cost" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "clinical_procedure" ADD COLUMN "proof" varchar(255);