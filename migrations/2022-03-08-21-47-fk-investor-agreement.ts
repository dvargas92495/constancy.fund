import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["ALTER TABLE `agreement` DROP COLUMN `email`,    DROP COLUMN `name`,    MODIFY `investorUuid` VARCHAR(191) NOT NULL;","ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_investorUuid_fkey` FOREIGN KEY (`investorUuid`) REFERENCES `Investor`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
