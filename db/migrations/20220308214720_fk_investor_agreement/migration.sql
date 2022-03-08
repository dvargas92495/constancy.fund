/*
  Warnings:

  - You are about to drop the column `email` on the `agreement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `agreement` table. All the data in the column will be lost.
  - Made the column `investorUuid` on table `agreement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `agreement` DROP COLUMN `email`,
    DROP COLUMN `name`,
    MODIFY `investorUuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_investorUuid_fkey` FOREIGN KEY (`investorUuid`) REFERENCES `Investor`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
