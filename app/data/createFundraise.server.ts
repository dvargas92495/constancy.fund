import { execute } from "./mysql.server";
import { dbIdByTypeId } from "../enums/fundraiseTypes";
import { v4 } from "uuid";
import type { FundraiseId } from "../enums/fundraiseTypes";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import type { Handler as AsyncHandler } from "../../functions/create-contract-pdf";

const createFundraise = ({
  data,
  id,
  userId,
}: {
  data: Record<string, string[]>;
  id: FundraiseId;
  userId: string;
}) => {
  const uuid = v4();
  const details = Object.entries(data).flatMap(([k, vs]) =>
    vs.map((v) => ({ k, v }))
  );
  return execute(
    `INSERT INTO contract (uuid, type, userId)
    VALUES (?, ?, ?)
  `,
    [uuid, dbIdByTypeId[id], userId]
  )
    .then(() =>
      execute(
        `
   INSERT INTO contractdetail (uuid, label, value, contractUuid)
   VALUES ${details.map(() => `(UUID(), ?, ?, ?)`)}
  `,
        details.flatMap((d) => [d.k, d.v, uuid])
      )
    )
    .then(() =>
      invokeAsync<Parameters<AsyncHandler>[0]>({
        path: "create-contract-pdf",
        data: { uuid },
      })
    )
    .then(() => uuid);
};

export default createFundraise;
