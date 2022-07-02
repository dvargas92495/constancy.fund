import getMysql from "./mysql.server";
import {
  NotFoundError,
  MethodNotAllowedError,
  ConflictError,
} from "aws-sdk-plus/dist/errors";

const deleteFundraiseData = ({
  uuid,
  userId,
}: {
  uuid: string;
  userId: string;
}) =>
  getMysql().then(({ execute, destroy }) => {
    return execute(`SELECT c.userId, c.uuid FROM contract c WHERE c.uuid = ?`, [
      uuid,
    ])
      .then(async (results) => {
        const [contract] = results as { userId: string; uuid: string }[];
        if (!contract)
          throw new NotFoundError(`Could not find contract ${uuid}`);
        if (userId !== contract.userId)
          throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
        const eversignDocs = await execute(
          `SELECT e.id FROM eversigndocument e INNER JOIN agreement a ON a.uuid = e.agreementUuid WHERE a.contractUuid = ?`,
          [contract.uuid]
        ).then((a) => a as { id: string }[]);
        if (eversignDocs.length)
          throw new ConflictError(
            `Cannot delete a fundraise with live legal documents.`
          );
        return Promise.all([
          execute(`DELETE FROM contractdetail WHERE contractUuid = ?`, [uuid]),
          execute(`DELETE FROM agreement WHERE contractUuid = ?`, [uuid]),
          execute(`DELETE FROM contractclause WHERE contractUuid = ?`, [uuid]),
        ])
          .then(() => execute(`DELETE FROM contract WHERE uuid = ?`, [uuid]))
          .then(destroy);
      })
      .then(() => ({ success: true }));
  });

export default deleteFundraiseData;
