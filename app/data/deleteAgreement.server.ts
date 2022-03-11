import { execute } from "../../app/data/mysql.server";
import { NotFoundError, MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const deleteAgreement = ({ uuid, userId }: { uuid: string; userId: string }) =>
  Promise.all([
    execute(
      `SELECT c.userId 
     FROM agreement a
     INNER JOIN contract c ON c.uuid = a.contractUuid
     WHERE a.uuid = ?`,
      [uuid]
    ),
    execute(
      `SELECT e.id 
     FROM eversigndocument e
     WHERE e.agreementUuid = ?`,
      [uuid]
    ),
  ])
    .then(([agreements, eversigns]) => {
      const [contract] = agreements as { userId: string }[];
      if (!contract)
        throw new NotFoundError(
          `Could not find contract based on agreement ${uuid}`
        );
      if (userId !== contract.userId)
        throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
      const eversignRecords = eversigns as { id: string }[];
      if (eversignRecords.length)
        throw new MethodNotAllowedError(
          `Not allowed to delete an agreement with a generated contract ${eversignRecords[0].id}`
        );
      return execute(
        `DELETE FROM agreement
        WHERE uuid = ?`,
        [uuid]
      );
    })
    .then(() => ({ success: true }));

export default deleteAgreement;
