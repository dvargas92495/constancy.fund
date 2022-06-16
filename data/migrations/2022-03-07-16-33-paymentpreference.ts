import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["CREATE TABLE `PaymentPreference` (    `uuid` VARCHAR(191) NOT NULL,    `userId` VARCHAR(191) NOT NULL,    `type` INTEGER NOT NULL,    PRIMARY KEY (`uuid`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;","CREATE TABLE `PaymentPreferenceDetail` (    `uuid` VARCHAR(191) NOT NULL,    `label` VARCHAR(191) NOT NULL,    `value` VARCHAR(191) NOT NULL,    `paymentPreferenceUuid` VARCHAR(191) NOT NULL,    PRIMARY KEY (`uuid`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;","ALTER TABLE `PaymentPreferenceDetail` ADD CONSTRAINT `PaymentPreferenceDetail_paymentPreferenceUuid_fkey` FOREIGN KEY (`paymentPreferenceUuid`) REFERENCES `PaymentPreference`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
