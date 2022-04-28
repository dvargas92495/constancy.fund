import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["ALTER TABLE `contract` ADD COLUMN `userId` VARCHAR(191) NOT NULL;"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
