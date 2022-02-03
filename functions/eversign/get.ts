import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import eversign from "../_common/eversign";

const logic = ({ uuid, signer }: { uuid: string; signer: string }) =>
  prisma.eversignDocument
    .findFirst({
      where: { agreementUuid: uuid },
      select: { id: true },
    })
    .then((d) => {
      if (!d)
        throw new NotFoundError(
          `Could not find contract generated by id ${uuid}`
        );
      return eversign
        .getDocumentByHash(d.id)
        .then(
          (doc) =>
            doc
              .getSigners()
              .find((s) => s.getId() === Number(signer))
              ?.getEmbeddedSigningUrl() || ""
        )
        .then((url) =>
          prisma.contract
            .findFirst({
              where: { agreements: { some: { uuid } } },
              select: { userId: true, type: true, uuid: true },
            })
            .then(async (c) => {
              if (!c)
                throw new MethodNotAllowedError(
                  `Cannot find fundraise tied to agreement ${uuid}`
                );
              return {
                userId: c.userId,
                type: FUNDRAISE_TYPES[c.type].name,
                agreementUuid: uuid,
                url,
              };
            })
        );
    })
    .then((r) => ({
      ...r,
      isInvestor: Number(signer) === 1,
    }));

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
