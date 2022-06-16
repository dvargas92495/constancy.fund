import type { MigrationProps } from "fuegojs/dist/migrate";
import getMysqlConnection from "../../app/data/mysql.server";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then(con => {
      const queries = ["CREATE UNIQUE INDEX `PaymentPreference_userId_type_key` ON `PaymentPreference`(`userId`, `type`);","CREATE UNIQUE INDEX `PaymentPreferenceDetail_paymentPreferenceUuid_label_key` ON `PaymentPreferenceDetail`(`paymentPreferenceUuid`, `label`);"];
      return queries
        .map(q => () => con.execute(q).then(() => console.log('executed query')))
        .reduce((p,c) => p.then(c), Promise.resolve())
  });
};

export const revert = () => {
  return Promise.resolve();
};
