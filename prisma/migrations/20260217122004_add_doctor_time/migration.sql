/*
  Warnings:

  - Made the column `time` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "time" SET NOT NULL;
