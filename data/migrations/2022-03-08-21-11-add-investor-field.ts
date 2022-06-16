import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((con) => {
    const queries = [
      "ALTER TABLE `agreement` ADD COLUMN `investorUuid` VARCHAR(191) NULL",
      "UPDATE agreement SET investorUuid = UUID()",
      "INSERT INTO `Investor` (uuid, name, email) SELECT a.investorUuid, a.name, a.email FROM agreement a;",
    ];
    return queries
      .map(
        (q) => () => con.execute(q).then(() => console.log("executed query"))
      )
      .reduce((p, c) => p.then(c), Promise.resolve());
  });
};

export const revert = () => {
  return Promise.resolve();
};
