import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(
      `CREATE TABLE IF NOT EXISTS contract_templates (
  uuid           VARCHAR(36)   NOT NULL,
  created_date   DATETIME(3)   NOT NULL,
  edited_date    DATETIME(3)   NOT NULL,
  name           VARCHAR(128)  NOT NULL,
  description    VARCHAR(1024) NOT NULL,
  help           VARCHAR(1024) NOT NULL,
  enabled        TINYINT(1)    NOT NULL,

  PRIMARY KEY (uuid),
  CONSTRAINT UC_source UNIQUE (name)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    )
  );
};

export const revert = ({ connection }: MigrationProps) => {
  return getMysqlConnection(connection).then((connection) =>
    connection.execute(`DROP TABLE contract_templates`)
  );
};
