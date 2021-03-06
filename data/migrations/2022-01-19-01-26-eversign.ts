import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["CREATE TABLE `EversignDocument` (    `id` VARCHAR(191) NOT NULL,    `agreementUuid` VARCHAR(191) NOT NULL,    UNIQUE INDEX `EversignDocument_agreementUuid_key`(`agreementUuid`),    PRIMARY KEY (`id`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;","ALTER TABLE `EversignDocument` ADD CONSTRAINT `EversignDocument_agreementUuid_fkey` FOREIGN KEY (`agreementUuid`) REFERENCES `Agreement`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
