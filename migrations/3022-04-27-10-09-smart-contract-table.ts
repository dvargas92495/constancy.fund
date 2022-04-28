import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../app/data/mysql.server";

export const migrate = ({ connection }: MigrationProps): Promise<void> => {
  return getMysqlConnection(connection)
    .then((connection) =>
      connection
        .execute(`SELECT migration_name FROM _migrations`)
        .then((s) => s as { migration_name: string }[])
        .then((ss) =>
          ss
            .map((s) => () => {
              const parts = s.migration_name.split("_");
              parts[0] = `${parts[0].slice(0, 4)}-${parts[0].slice(
                4,
                6
              )}-${parts[0].slice(6, 8)}-${parts[0].slice(
                8,
                10
              )}-${parts[0].slice(10, 12)}`;
              const newS = parts[0].startsWith("3")
                ? `2${s.migration_name.slice(1)}`
                : parts.join("-");
              return connection
                .execute(
                  `UPDATE _migrations SET migration_name = ? WHERE migration_name = ?`,
                  [newS, s.migration_name]
                )
                .then(() =>
                  console.log("migrated", s.migration_name, "to", newS)
                );
            })
            .reduce((p, c) => p.then(c), Promise.resolve())
        )
        .then(() =>
          connection.execute(
            `CREATE TABLE IF NOT EXISTS smart_contract (
          hash      VARCHAR(36)  NOT NULL,
          contract  VARCHAR(191) NOT NULL,
          version   VARCHAR(191) NOT NULL,
  
          PRIMARY KEY (hash),
          CONSTRAINT UC_source UNIQUE (contract,version)
      )`
          )
        )
    )
    .then(() => Promise.resolve());
};

export const revert = () => {
  return Promise.resolve();
};
