import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import { Client } from "@dvargas92495/eversign";
const eversign = new Client(process.env.EVERSIGN_API_KEY || "", 398320);

const getFundraiseData = ({
  uuid,
  userId,
}: {
  uuid: string;
  userId: string;
}) => {
  const { execute, destroy } = getMysql();
  return execute(
    `SELECT c.type, c.userId, a.uuid, a.amount, i.name, i.email, e.id, cd.label, cd.value
   FROM contract c
   LEFT JOIN agreement a ON a.contractUuid = c.uuid
   LEFT JOIN investor i ON i.uuid = a.investorUuid
   INNER JOIN contractdetail cd ON c.uuid = cd.contractUuid
   LEFT JOIN eversigndocument e ON e.agreementUuid = a.uuid
   WHERE c.uuid = ?`,
    [uuid]
  ).then(async (results) => {
    destroy();
    const fundraise = results as {
      type: number;
      userId: string;
      uuid: string;
      amount: number;
      name: string;
      email: string;
      id?: string;
      label: string;
      value: string;
    }[];
    if (!fundraise.length)
      throw new NotFoundError(`Could not find contract with id ${uuid}`);
    if (userId !== fundraise[0].userId)
      throw new MethodNotAllowedError(
        `User not authorized to view agreements in contract ${uuid}`
      );
    const statuses = await Promise.all(
      Array.from(new Set(fundraise.map(({ id }) => id)))
        .filter((id) => !!id)
        .map((id) =>
          eversign
            .getDocumentByHash(id!)
            .then((r) =>
              r.getSigners().every((s) => s.getSigned())
                ? 3
                : r.getSigners()[0].getSigned()
                ? 2
                : 1
            )
            .catch(() => 0)
            .then((status) => [id, status])
        )
    ).then((entries) => Object.fromEntries(entries) as Record<string, number>);
    const agreements: Record<
      string,
      {
        amount: number;
        name: string;
        email: string;
        status: number;
      }
    > = {};
    const details: Record<string, string> = {};
    fundraise.forEach((f) => {
      if (f.uuid) {
        agreements[f.uuid] = {
          amount: f.amount,
          name: f.name,
          email: f.email,
          status: statuses[f.id || ""] || 0,
        };
      }
      details[f.label] = f.value;
    });

    return {
      type: FUNDRAISE_TYPES[fundraise[0].type].id,
      agreements: Object.entries(agreements)
        .map(([uuid, a]) => ({
          uuid,
          ...a,
        }))
        .sort((a, b) => b.status - a.status),
      details,
    };
  });
};

export default getFundraiseData;
