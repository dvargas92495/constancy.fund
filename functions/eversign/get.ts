import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
/* Document module not found
import { Client } from "eversign";
const eversign = new Client(process.env.EVERSIGN_API_KEY, 398320);

const logic = ({ id, signer }: { id: string; signer: string }) =>
  eversign.getDocumentByHash(id).then((r) => ({
    url: r
      .getSigners()
      .find((s) => s.getId() === Number(signer))
      ?.getEmbeddedSigningUrl(),
    ...(r.getMeta() as { userId: string; agreementUuid: string; type: string }),
  }));
  */

import axios from "axios";

const logic = ({ id, signer }: { id: string; signer: string }) =>
  axios
    .get(
      `https://api.eversign.com/api/document?access_key=${process.env.EVERSIGN_API_KEY}&business_id=398320&document_hash=${id}`
    )
    .then((r) => ({
      url: r.data.signers.find((s) => s.id === Number(signer))
        ?.embedded_signing_url as string,
      ...(r.data.meta as {
        userId: string;
        agreementUuid: string;
        type: string;
      }),
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
