import getConnection from "./mysql.server";
import invokeAsync from "./invokeAsync.server";
import { dbIdByTypeId } from "../enums/fundraiseTypes";
import { v4 } from "uuid";
import type { FundraiseId } from "../enums/fundraiseTypes";
import type { Handler as AsyncHandler } from "../../api/create-contract-pdf";

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
  const details = Object.entries(data)
    .filter(([k]) => k !== "clauses")
    .flatMap(([k, vs]) => vs.map((v) => ({ k, v })));
  const clauses = data["clauses"] || [];
  if (clauses.some((c) => !c))
    throw new Error("Cannot create fundraise with an empty additional clause");

  return getConnection().then(({ execute, destroy }) => {
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
        clauses.length
          ? execute(
              `
 INSERT INTO contractclause (uuid, value, contractUuid)
 VALUES ${clauses.map(() => `(UUID(), ?, ?)`)}
`,
              clauses.flatMap((c) => [c, uuid])
            ).then(() => Promise.resolve())
          : Promise.resolve()
      )
      .then(() => {
        destroy();
        return invokeAsync<Parameters<AsyncHandler>[0]>({
          path: "create-contract-pdf",
          data: { uuid },
        });
      })
      .then(() => uuid);
  });
};

export default createFundraise;
