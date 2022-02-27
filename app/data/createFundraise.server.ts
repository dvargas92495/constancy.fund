import { execute } from "./mysql";
import { dbIdByTypeId } from "../../db/fundraise_types";
import { v4 } from "uuid";
import type { FundraiseId } from "../../db/fundraise_types";
import invokeAsync from "@dvargas92495/api/invokeAsync";
import type { Handler as AsyncHandler } from "../../functions/create-contract-pdf";

const validateData: Record<
  FundraiseId,
  (data: Record<string, string[]>) => void
> = {
  isa: (data) => {
    if (!data.supportType[0]) throw new Error("`supportType` is required");
    else if (!data.amount[0]) throw new Error("`amount` is required");
    else if (Number(data.amount[0]) < 100)
      throw new Error("`amount` must be at least $100");
    else if (data.supportType[0] === "monthly" && !data.frequency[0])
      throw new Error("`frequency` is required when `supportType` is monthly.");
    else if (
      data.supportType[0] === "monthly" &&
      Number(data.frequency[0]) < 12
    )
      throw new Error(
        "`frequency` must be at least 12 months when `supportType` is monthly."
      );
    else if (!data.return[0]) throw new Error("`total` is required");
    else if (
      Number(data.return[0]) <
      Number(data.amount[0]) * Number(data.frequency[0] || 1)
    )
      throw new Error("`return` must be at least 100% ot the amount raised.");
    else if (!data.share[0]) throw new Error("`share` is required");
    else if (Number(data.share[0]) < 1)
      throw new Error("`share` must be at least 1%");
    else if (Number(data.share[0]) > 100)
      throw new Error("`share` must be at most 100%");
    else if (!data.cap[0]) throw new Error("`cap` is required");
    else if (Number(data.cap[0]) < 1)
      throw new Error("`cap` must be at least 1 year");
  },
  loan: () => {},
  custom: () => {},
} as const;

const createFundraise = ({
  data,
  id,
  userId,
}: {
  data: Record<string, string[]>;
  id: FundraiseId;
  userId: string;
}) => {
  if (!validateData[id]) throw new Error(`Unknown fundraise type ${id}`);
  validateData[id as keyof typeof validateData](data);
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
