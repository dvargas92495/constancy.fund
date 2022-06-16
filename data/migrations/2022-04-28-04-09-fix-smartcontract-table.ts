import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((cxn) =>
    cxn
      .execute(`RENAME TABLE smart_contract TO smart_contracts`)
      .then(() =>
        cxn.execute(`ALTER TABLE smart_contracts MODIFY hash VARCHAR(64)`)
      )
  );
};

export const revert = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((cxn) =>
    cxn
      .execute(`ALTER TABLE smart_contracts MODIFY hash VARCHAR(36)`)
      .then(() => cxn.execute(`RENAME TABLE smart_contracts TO smart_contract`))
  );
};
