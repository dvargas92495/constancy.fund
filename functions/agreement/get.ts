import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const logic = ({ uuid }: { uuid: string }) =>
  prismaClient.agreement
    .findFirst({
      where: { uuid },
    })
    .then((agreement) => {
      if (!agreement)
        throw new NotFoundError(`Could not find agreement with id ${uuid}`);
      return agreement;
    });

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
