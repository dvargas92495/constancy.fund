import { BadRequestError, NotFoundError } from "aws-sdk-plus/dist/errors";
import getUserProfile from "./getUserProfile.server";
import getMysql from "./mysql.server";

const getAgreementAsPotentialInvestor = ({
  investorUserId,
  agreement,
  fundraise,
  creatorUserId,
}: {
  investorUserId: string;
  creatorUserId: string;
  agreement?: string;
  fundraise?: string;
}) =>
  getMysql().then(({ execute, destroy }) => {
    return (
      agreement
        ? execute(
            `SELECT i.name, i.email, a.amount, a.uuid, cd.label, cd.value, c.userId, c.uuid as contractUuid
     FROM agreement a
     INNER JOIN investor i ON a.investorUuid = i.uuid
     INNER JOIN contract c ON a.contractUuid = c.uuid
     INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
     WHERE a.uuid = ?`,
            [agreement]
          )
        : fundraise
        ? execute(
            `SELECT cd.label, cd.value, c.userId, c.uuid as contractUuid
       FROM contract c
       INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
       WHERE c.uuid = ?`,
            [fundraise]
          )
        : execute(
            `SELECT cd.label, cd.value, c.userId, c.uuid as contractUuid
       FROM contract c
       INNER JOIN contractdetail cd ON cd.contractUuid = c.uuid
       WHERE c.userId = ?`,
            [creatorUserId]
          ).then((res) =>
            (res as { contractUuid: string }[]).filter(
              (r, _, all) => r.contractUuid === all[0].contractUuid
            )
          )
    ).then((results) => {
      const fundraises = results as {
        name?: string;
        email?: string;
        amount?: number;
        uuid?: string;
        label: string;
        value: string;
        userId: string;
        contractUuid: string;
      }[];
      if (!fundraises.length)
        throw new NotFoundError(
          `Could not find fundraise based on the input parameters`
        );
      if (fundraises[0].userId !== creatorUserId)
        throw new BadRequestError(
          `Fundraise found is not owned by userId ${creatorUserId}`
        );
      const details: Record<string, string> = Object.fromEntries(
        fundraises.map((f) => [f.label, f.value])
      );
      return Promise.all([
        investorUserId ? getUserProfile(investorUserId, execute) : undefined,
        // getUserProfile(fundraises[0].userId, execute), We don't need creator data anymore?
      ]).then(([
        investor
        // user, 
      ]) => {
        destroy();
        return {
          details,
          investor,
          name: investor?.name || fundraises[0].name || "",
          email: investor?.contactEmail || fundraises[0].email || "",
          amount: fundraises[0].amount || 0,
          uuid: fundraises[0].uuid || "",
          contractUuid: fundraises[0].contractUuid,
        };
      });
    });
  });

export default getAgreementAsPotentialInvestor;
