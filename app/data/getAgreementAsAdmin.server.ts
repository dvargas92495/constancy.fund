import verifyAdminUser from "./verifyAdminUser.server";
import getMysql from "./mysql.server";
import getEversign from "./eversign.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import STAGES from "../../app/enums/contract_stages";
import { displayNameById } from "~/enums/web3Networks";

const getAgreementAsAdmin = (
  userId: string,
  params: Record<string, string>
) => {
  return verifyAdminUser(userId)
    .then(() => getMysql())
    .then(({ execute, destroy }) =>
      execute(
        `SELECT c.type, c.userId, a.uuid, a.amount, i.name, i.email, e.id, d.label, d.value, sc.address, sc.network
FROM agreement a
INNER JOIN contract c ON a.contractUuid = c.uuid
INNER JOIN contractdetail d ON d.contractUuid = c.uuid
LEFT JOIN investor i ON i.uuid = a.investorUuid
LEFT JOIN eversigndocument e ON e.agreementUuid = a.uuid
LEFT JOIN deployed_smart_contracts sc ON sc.agreement_uuid = a.uuid
WHERE a.uuid = ?`,
        [params["uuid"]]
      ).then(async (results) => {
        destroy();
        const details = results as {
          type: number;
          userId: string;
          uuid: string;
          amount: number;
          name: string;
          email: string;
          id?: string;
          label: string;
          value: string;
          address?: string;
          network?: number;
        }[];
        if (!details.length)
          throw new Response(`Could not find agreement: ${params["uuid"]}`, {
            status: 404,
          });
        const [agreement] = details;
        const { id } = agreement;
        const status = id
          ? await getEversign()
              .then((eversign) => eversign.getDocumentByHash(id))
              .then((r) =>
                r.getSigners().every((s) => s.getSigned())
                  ? 3
                  : r.getSigners()[0].getSigned()
                  ? 2
                  : 1
              )
              .catch(() => 0)
          : 0;
        const creator = await import("@clerk/clerk-sdk-node").then((clerk) =>
          clerk.users.getUser(agreement.userId)
        );
        return {
          type: FUNDRAISE_TYPES[agreement.type].id,
          uuid: agreement.uuid,
          creatorName: `${creator.firstName} ${creator.lastName}`,
          creatorEmail: creator.emailAddresses.find(
            (e) => e.id === creator.primaryEmailAddressId
          )?.emailAddress,
          investorName: agreement.name,
          investorEmail: agreement.email,
          status: STAGES[status],
          details: Object.fromEntries(details.map((d) => [d.label, d.value])),
          amount: agreement.amount,
          network: displayNameById[agreement.network || 0],
          address: agreement.address,
        };
      })
    );
};

export default getAgreementAsAdmin;
