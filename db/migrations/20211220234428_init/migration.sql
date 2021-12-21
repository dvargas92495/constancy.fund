-- CreateTable
CREATE TABLE `Contract` (
    `uuid` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContractDetail` (
    `uuid` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `contractUuid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContractDetail` ADD CONSTRAINT `ContractDetail_contractUuid_fkey` FOREIGN KEY (`contractUuid`) REFERENCES `Contract`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
