import { users } from "@clerk/clerk-sdk-node";
import formatError from "@dvargas92495/api/formatError";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";

const logic = ({ id }: { id: string }) => {
  return Promise.all([
    users.getUser(id),
    prisma.contract.findMany({ where: { userId: id } }),
  ])
    .then(([u, fs]) => ({
      userId: id,
      fullName: `${u.firstName} ${typeof u.publicMetadata.middleName === "string"
          ? `${u.publicMetadata.middleName.slice(0, 1)}`
          : ""
        }${u.lastName}`,
      email:
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
          ?.emailAddress || "",
      profileImageUrl: u.profileImageUrl || "",
      socialProfiles: (
        (u.publicMetadata.socialProfiles as string[]) || []
      ).filter((s) => !!s),
      questionaires: u.publicMetadata.questionaires as string[],
      fundraises: fs.map((f) => ({ type: f.type, uuid: f.uuid })),
    }))
    .catch((e) => {
      console.error(formatError(e));
      return {
        userId: id,
        fullName: ``,
        email: "",
        profileImageUrl: "",
        socialProfiles: [] as string[],
        questionaires: [] as string[],
        fundraises: [] as { type: number; uuid: string }[],
      };
    });
};

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
