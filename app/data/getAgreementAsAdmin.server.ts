import verifyAdminUser from "./verifyAdminUser.server";
import getMysql from "./mysql.server";
import getEversign from "./eversign.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import STAGES from "../../app/enums/contract_stages";
import { infuraEthersProvidersById } from "~/enums/web3Networks";
import getEthereumAbiByFundraiseType from "./getEthereumAbiByFundraiseType.server";
import axios from "axios";
import FormData from "form-data";

const Authorization = `Basic ${Buffer.from(
  `${process.env.IPFS_INFURA_ID}:${process.env.IPFS_INFURA_SECRET}`
).toString("base64")}`;

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
        if (!details.length) {
          throw new Response(`Could not find agreement: ${params["uuid"]}`, {
            status: 404,
          });
        }
        const [agreement] = details;
        const agreementType = FUNDRAISE_TYPES[agreement.type].id;
        const contractJson = await getEthereumAbiByFundraiseType(
          agreementType,
          execute
        );
        destroy();
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
        const formData = new FormData();
        const ls = await axios
          .post(
            `https://ipfs.infura.io:5001/api/v0/pin/ls?arg=${contractJson.versionHash}`,
            formData,
            {
              headers: {
                ...formData.getHeaders(),
                Authorization,
              },
            }
          )
          .then((r) => JSON.stringify(r.data))
          .catch((e) => JSON.stringify(e.response?.data));
        return {
          type: agreementType,
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
          network: infuraEthersProvidersById[agreement.network || 0],
          address: agreement.address,
          contractJson,
          ls,
        };
      })
    );
};

export default getAgreementAsAdmin;
