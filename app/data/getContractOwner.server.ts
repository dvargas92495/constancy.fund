import { MethodNotAllowedError } from "aws-sdk-plus/dist/errors";
import getMysql from "./mysql.server";

const getContractOwner = ({uuid}: {uuid: string}) => {
  return getMysql().then(({ execute, destroy }) => {
    return execute(
      `SELECT f.userId
      FROM agreement a
      INNER JOIN contract f ON f.uuid = a.contractUuid
      WHERE a.uuid = ?`,
      [uuid]
    ).then(async (c) => {
      destroy();
      const results = c as {
        userId: string;
        type: number;
        uuid: string;
      }[];
      if (!results.length)
        throw new MethodNotAllowedError(
          `Cannot find fundraise tied to agreement ${uuid}`
        );
      return {
        userId: results[0].userId,
      };
    });
  });
};

export default getContractOwner;
