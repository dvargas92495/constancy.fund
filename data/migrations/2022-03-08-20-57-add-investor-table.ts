import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["ALTER TABLE `agreement` DROP COLUMN `stage`;","CREATE TABLE `Investor` (    `uuid` VARCHAR(191) NOT NULL,    `name` VARCHAR(191) NOT NULL,    `email` VARCHAR(191) NOT NULL,    PRIMARY KEY (`uuid`)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
