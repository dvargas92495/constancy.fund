import getMysql from "./mysql.server";
import getUserProfile from "./getUserProfile.server";
import { Id as PaymentPreferenceId } from "~/enums/paymentPreferences";

const getPublicUserProfile = (id: string) =>
  getMysql().then(({ execute, destroy }) => {
    return Promise.all([
      getUserProfile(id),
      execute(
        `SELECT c.type, c.uuid, cd.label, cd.value
        FROM contract c
        INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
        WHERE c.userId = ?`,
        [id]
      ).then((fs) => {
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
        destroy();
        return fundraises;
      }),
    ]).then(([{ id, ...u }, fundraises]) => {
      return {
        ...u,
        userId: id,
        fullName: `${u.firstName} ${
          typeof u.middleName === "string"
            ? `${u.middleName.slice(0, 1)}. `
            : ""
        }${u.lastName}`,
        socialProfiles: u.socialProfiles.filter((s) => !!s),
        paymentPreferences: Object.keys(
          u.paymentPreferences
        ) as PaymentPreferenceId[],
        fundraises: Object.entries(fundraises).map(([uuid, v]) => ({
          uuid,
          type: v.type,
          details: v.details,
        })),
      };
    });
  });

export default getPublicUserProfile;
