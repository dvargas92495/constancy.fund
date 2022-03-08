/*
  Warnings:

  - You are about to drop the column `stage` on the `agreement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `agreement` DROP COLUMN `stage`;

-- CreateTable
CREATE TABLE `Investor` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
