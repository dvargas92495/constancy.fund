-- AlterTable
ALTER TABLE `agreement` ADD COLUMN `investorUuid` VARCHAR(191) NULL;

UPDATE agreement SET investorUuid = UUID();
INSERT INTO `Investor` (uuid, name, email) SELECT a.investorUuid, a.name, a.email FROM agreement a;
