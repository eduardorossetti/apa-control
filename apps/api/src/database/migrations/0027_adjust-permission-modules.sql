DELETE FROM "permission" WHERE "module_id" IN (12, 16);--> statement-breakpoint
DELETE FROM "module" WHERE "id" IN (12, 16);--> statement-breakpoint

INSERT INTO "module" ("id", "name", "parent_id", "title") VALUES
  (25, 'Occurrences', 1, 'Ocorrências'),
  (26, 'OccurrenceTypes', 17, 'Tipos de Ocorrência');
