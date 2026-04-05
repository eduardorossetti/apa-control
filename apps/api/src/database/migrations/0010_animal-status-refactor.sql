ALTER TABLE "animal" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."animal_status";--> statement-breakpoint
CREATE TYPE "public"."animal_status" AS ENUM('pendente', 'ativo', 'inativo');--> statement-breakpoint
UPDATE "animal" SET "status" = 'pendente' WHERE "status" = 'disponivel';--> statement-breakpoint
UPDATE "animal" SET "status" = 'ativo' WHERE "status" = 'em_tratamento';--> statement-breakpoint
UPDATE "animal" SET "status" = 'inativo' WHERE "status" = 'adotado';--> statement-breakpoint
ALTER TABLE "animal" ALTER COLUMN "status" SET DATA TYPE "public"."animal_status" USING "status"::"public"."animal_status";--> statement-breakpoint
ALTER TABLE "animal" ADD COLUMN "rescue_at" timestamp;
