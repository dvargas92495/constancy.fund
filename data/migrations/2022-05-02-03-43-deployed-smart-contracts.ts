import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `CREATE TABLE IF NOT EXISTS deployed_smart_contracts (
  uuid           VARCHAR(36)  NOT NULL,
  address        VARCHAR(64)  NOT NULL,
  network        INT          NOT NULL,
  agreement_uuid VARCHAR(191) NOT NULL,
  hash           VARCHAR(64)  NOT NULL,

  PRIMARY KEY (uuid),
  FOREIGN KEY (agreement_uuid) REFERENCES \`agreement\`(\`uuid\`),
  CONSTRAINT UC_source UNIQUE (address,network)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    )
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE deployed_smart_contracts`)
  );
};
