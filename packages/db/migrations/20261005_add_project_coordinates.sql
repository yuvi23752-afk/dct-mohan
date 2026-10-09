ALTER TABLE "Project"
  ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

UPDATE "Project"
SET "latitude" = 13.003789,
    "longitude" = 80.262671
WHERE LOWER(TRIM("name")) = 'dct paradise';

UPDATE "Project"
SET "latitude" = 13.0294519,
    "longitude" = 80.1952235
WHERE LOWER(TRIM("name")) = 'dct heights';
