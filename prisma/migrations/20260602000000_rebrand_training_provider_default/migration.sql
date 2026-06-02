-- Rebrand the training program provider default off the OrigineMaroc template.
ALTER TABLE "training_program" ALTER COLUMN "provider" SET DEFAULT 'Nevali Academy';

-- Re-label any existing rows still carrying the old template default.
UPDATE "training_program" SET "provider" = 'Nevali Academy' WHERE "provider" = 'OrigineMaroc Academy';
