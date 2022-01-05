import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { NotFoundError } from "aws-sdk-plus/dist/errors";
import prisma from "../_common/prisma";

const logic = ({ uuid }: { uuid: string }) =>
  prisma.agreement
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
