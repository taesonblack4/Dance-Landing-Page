/*
  Warnings:

  - You are about to drop the `Dancer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dancer";

-- CreateTable
CREATE TABLE "Leads" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "services" TEXT[],
    "technique" TEXT[],
    "message" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("id")
);
