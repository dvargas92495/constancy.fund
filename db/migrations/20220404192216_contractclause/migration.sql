-- AlterTable
ALTER TABLE `contractdetail` MODIFY `value` TEXT NOT NULL;

-- CreateTable
CREATE TABLE `ContractClause` (
    `uuid` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `contractUuid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContractClause` ADD CONSTRAINT `ContractClause_contractUuid_fkey` FOREIGN KEY (`contractUuid`) REFERENCES `Contract`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
