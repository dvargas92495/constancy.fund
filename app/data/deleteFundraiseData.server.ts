import { execute } from "./mysql.server";
import { NotFoundError, MethodNotAllowedError } from "aws-sdk-plus/dist/errors";

const deleteFundraiseData = ({
  uuid,
  userId,
}: {
  uuid: string;
  userId: string;
}) =>
  execute(`SELECT c.userId FROM contract c WHERE c.uuid = ?`, [uuid])
    .then((results) => {
      const [contract] = results as { userId: string }[];
      if (!contract) throw new NotFoundError(`Could not find contract ${uuid}`);
      if (userId !== contract.userId)
        throw new MethodNotAllowedError(`Not authorized to delete ${uuid}`);
      return Promise.all([
        execute(`DELETE FROM contractdetail d WHERE d.contractUuid = ?`, [
          uuid,
        ]),
        execute(`DELETE FROM agreement a WHERE a.contractUuid = ?`, [uuid]),
      ]).then(() => execute(`DELETE FROM contract c WHERE c.uuid = ?`, [uuid]));
    })
    .then(() => ({ success: true }));

export default deleteFundraiseData;
