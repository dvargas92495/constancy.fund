import { NotFoundError } from "aws-sdk-plus/dist/errors";
import getPaymentPreferences from "./getPaymentPreferences.server";
import getMysql from "./mysql.server";

const getContractPaymentPreferences = ({
  uuid,
  isInvestor,
}: {
  uuid: string;
  isInvestor: boolean;
}) => {
  return getMysql().then(({ execute, destroy }) => {
    return execute(
      `SELECT i.uuid, c.userId
         FROM agreement a
         INNER JOIN investor i ON i.uuid = a.investorUuid
         INNER JOIN contract c ON c.uuid = a.contractUuid
         WHERE a.uuid = ?`,
      [uuid]
    ).then((results) => {
      const [doc] = results as {
        uuid: string;
        userId: string;
      }[];
      if (!doc)
        throw new NotFoundError(
          `Could not find eversign document associated with agreement ${uuid}`
        );
      return getPaymentPreferences(
        isInvestor ? doc.userId : doc.uuid,
        execute
      ).then((data) => {
        destroy();
        return data;
      });
    });
  });
};

export default getContractPaymentPreferences;
