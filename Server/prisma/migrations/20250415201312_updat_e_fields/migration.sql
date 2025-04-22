/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Super` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "technique" TEXT[],
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Super_username_key" ON "Super"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
