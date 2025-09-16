/*
  Warnings:

  - The values [One,Two,Three,Four] on the enum `BHK` will be removed. If these variants are still used in the database, this will fail.
  - The values [EXPLORING] on the enum `Timeline` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BHK_new" AS ENUM ('1', '2', '3', '4', 'Studio');
ALTER TABLE "public"."Buyer" ALTER COLUMN "bhk" TYPE "public"."BHK_new" USING ("bhk"::text::"public"."BHK_new");
ALTER TYPE "public"."BHK" RENAME TO "BHK_old";
ALTER TYPE "public"."BHK_new" RENAME TO "BHK";
DROP TYPE "public"."BHK_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Timeline_new" AS ENUM ('0-3m', '3-6m', '>6m', 'Exploring');
ALTER TABLE "public"."Buyer" ALTER COLUMN "timeline" TYPE "public"."Timeline_new" USING ("timeline"::text::"public"."Timeline_new");
ALTER TYPE "public"."Timeline" RENAME TO "Timeline_old";
ALTER TYPE "public"."Timeline_new" RENAME TO "Timeline";
DROP TYPE "public"."Timeline_old";
COMMIT;
