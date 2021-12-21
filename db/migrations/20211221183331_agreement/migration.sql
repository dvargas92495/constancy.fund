/*
  Warnings:

  - You are about to drop the column `status` on the `contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contract` DROP COLUMN `status`;

-- CreateTable
CREATE TABLE `Agreement` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `contractUuid` VARCHAR(191) NOT NULL,
    `stage` INTEGER NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_contractUuid_fkey` FOREIGN KEY (`contractUuid`) REFERENCES `Contract`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
