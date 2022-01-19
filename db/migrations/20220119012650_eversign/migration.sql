-- CreateTable
CREATE TABLE `EversignDocument` (
    `id` VARCHAR(191) NOT NULL,
    `agreementUuid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EversignDocument_agreementUuid_key`(`agreementUuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EversignDocument` ADD CONSTRAINT `EversignDocument_agreementUuid_fkey` FOREIGN KEY (`agreementUuid`) REFERENCES `Agreement`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
