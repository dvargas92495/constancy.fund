import { users } from "@clerk/clerk-sdk-node";
import formatError from "@dvargas92495/api/formatError";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { execute } from "../_common/mysql";

const logic = ({ id }: { id: string }) => {
  return Promise.all([
    users.getUser(id),
    execute(
      `SELECT c.type, c.uuid, cd.label, cd.value
      FROM contract c
      INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
      WHERE c.userId = ?`,
      [id]
    ),
  ])
    .then(([u, fs]) => {
      const results = fs as {
        type: number;
        uuid: string;
        label: string;
        value: string;
      }[];
      
      const fundraises: Record<
        string,
        { type: number; details: Record<string, string> }
      > = {};
      results.forEach((res) => {
        if (fundraises[res.uuid]) {
          fundraises[res.uuid].details[res.label] = res.value;
        } else {
          fundraises[res.uuid] = {
            type: res.type,
            details: { [res.label]: res.value },
          };
        }
      });
      return {
        userId: id,
        fullName: `${u.firstName} ${
          typeof u.publicMetadata.middleName === "string"
            ? `${u.publicMetadata.middleName.slice(0, 1)}. `
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
        fundraises: Object.entries(fundraises).map(([uuid, v]) => ({
          uuid,
          type: v.type,
          details: v.details,
        })),
      };
    })
    .catch((e) => {
      console.error(formatError(e));
      return {
        userId: id,
        fullName: ``,
        email: "",
        profileImageUrl: "",
        socialProfiles: [] as string[],
        questionaires: [] as string[],
        fundraises: [] as {
          type: number;
          uuid: string;
          details: Record<string, string>;
        }[],
      };
    });
};

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
