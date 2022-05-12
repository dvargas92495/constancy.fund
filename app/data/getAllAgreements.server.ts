import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import STAGES from "../../app/enums/contract_stages";
import getEversign from "./eversign.server";
import verifyAdminUser from "./verifyAdminUser.server";

const getAllAgreements = (userId: string) =>
  verifyAdminUser(userId)
    .then(() => getMysql())
    .then(({ execute, destroy }) => {
      return execute(
        `SELECT c.type, c.userId, a.uuid, a.amount, i.name, i.email, e.id
   FROM agreement a
   INNER JOIN contract c ON a.contractUuid = c.uuid
   LEFT JOIN investor i ON i.uuid = a.investorUuid
   LEFT JOIN eversigndocument e ON e.agreementUuid = a.uuid`,
        []
      ).then(async (results) => {
        destroy();
        const agreements = results as {
          type: number;
          userId: string;
          uuid: string;
          amount: number;
          name: string;
          email: string;
          id?: string;
        }[];
        const statuses = await Promise.all(
          Array.from(new Set(agreements.map(({ id }) => id)))
            .filter((id): id is string => !!id)
            .map((id) =>
              getEversign()
                .then((eversign) => eversign.getDocumentByHash(id))
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
        ).then(
          (entries) => Object.fromEntries(entries) as Record<string, number>
        );

        return {
          agreements: agreements.map((a) => ({
            ...a,
            status: STAGES[statuses[a.id || ""] || 0],
            type: FUNDRAISE_TYPES[a.type].id,
          })),
        };
      });
    })
    .catch(() => ({
      agreements: [],
    }));

export default getAllAgreements;
