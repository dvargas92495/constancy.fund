import getMysql from "./mysql.server";
import FUNDRAISE_TYPES from "../../app/enums/fundraiseTypes";
import STAGES from "../../app/enums/contract_stages";
import getEversign from "./eversign.server";
import verifyAdminUser from "./verifyAdminUser.server";

const getAllAgreements = (userId: string) =>
  verifyAdminUser(userId)
    .then(() => getMysql())
    .then(({ execute, destroy }) => {
      return execute(
        `SELECT * FROM contract_templates`,
        []
      ).then(async (results) => {
        destroy();
        const templates = results as {
          created_date: Date;
          updated_date: Date;
          uuid: string;
          name: string;
          description: string;
          help: string;
          enabled: boolean;
        }[];

        return {
          data: templates.map((a) => ({
            uuid: a.uuid,
          })),
          columns: [
            { label: "Type", key: "type" },
            { label: "Status", key: "status" },
            { label: "Creator Name", key: "userId" },
            { label: "Investor Name", key: "name" },
            { label: "Amount", key: "amount" },
          ],
        };
      });
    })
    .catch(() => ({
      data: [],
    }));

export default getAllAgreements;
