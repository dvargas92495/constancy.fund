import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import prisma from "../_common/prisma";
import type { User } from "@clerk/clerk-sdk-node";
import FUNDRAISE_TYPES from "../../db/fundraise_types";
import axios from "axios";

const logic = ({ uuid, user: { id } }: { uuid: string; user: User }) =>
  prisma.contract
    .findFirst({
      where: { uuid },
      select: {
        type: true,
        userId: true,
        agreements: {
          select: {
            uuid: true,
            amount: true,
            name: true,
            email: true,
            eversign: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    .then((fundraise) => {
      if (!fundraise)
        throw new NotFoundError(`Could not find contract with id ${uuid}`);
      if (id !== fundraise.userId)
        throw new MethodNotAllowedError(
          `Could not find contract with id ${uuid}`
        );
      return Promise.all(
        fundraise.agreements.map(({ eversign, ...a }) =>
          (eversign
            ? axios
                .get<{
                  signers: {
                    id: number;
                    signed: 1 | 0;
                  }[];
                }>(
                  `https://api.eversign.com/api/document?access_key=${process.env.EVERSIGN_API_KEY}&business_id=398320&document_hash=${eversign?.id}`
                )
                .then((r) =>
                  r.data.signers[1].signed
                    ? 2
                    : r.data.signers[0].signed
                    ? 1
                    : 0
                )
            : Promise.resolve(0)
          ).then((status) => ({
            ...a,
            status,
          }))
        )
      ).then((agreements) => ({
        type: FUNDRAISE_TYPES[fundraise.type].id,
        agreements,
      }));
    });

export const handler = clerkAuthenticateLambda(
  createAPIGatewayProxyHandler(logic)
);
export type Handler = typeof logic;
