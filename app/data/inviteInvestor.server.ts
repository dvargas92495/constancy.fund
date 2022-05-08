import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import type { User } from "@clerk/clerk-sdk-node";
import getMysql from "./mysql.server";
import { v4 } from "uuid";
import invokeAsync from "./invokeAsync.server";

const inviteInvestor = ({
  user,
  uuid,
  name,
  email,
  amount,
}: {
  user: User;
  uuid: string;
  name: string;
  email: string;
  amount: number;
}) =>
  getMysql().then(({ execute, destroy }) => {
    return execute(`SELECT c.userId FROM contract c WHERE c.uuid = ?`, [uuid])
      .then((results) => {
        const [fundraise] = results as { userId: string }[];
        if (!fundraise)
          throw new NotFoundError(`Could not find contract with id ${uuid}`);
        if (user.id !== fundraise.userId)
          throw new MethodNotAllowedError(
            `Could not find contract with id ${uuid}`
          );
        const investorUuid = v4();
        return execute(
          `INSERT INTO investor (uuid, name, email) VALUES (?, ?, ?)`,
          [investorUuid, name, email]
        ).then(() => {
          const agreementUuid = v4();
          return execute(
            `INSERT INTO agreement (uuid, amount, contractUuid, investorUuid) VALUES (?, ?, ?, ?)`,
            [agreementUuid, amount, uuid, investorUuid]
          ).then(() => agreementUuid);
        });
      })
      .then((agreementUuid) => {
        destroy();
        return invokeAsync({
          path: "send-email",
          data: {
            to: email,
            replyTo:
              user.emailAddresses.find(
                (e) => e.id === user.primaryEmailAddressId
              )?.emailAddress || undefined,
            subject: `Invitation to fund ${user.firstName} ${user.lastName}`,
            bodyComponent: "invitation-to-fund",
            bodyProps: {
              investorName: name,
              creatorName: `${user.firstName} ${user.lastName}`,
              creatorId: user.id || "",
              agreementUuid,
            },
          },
        }).then(() => ({ uuid: agreementUuid }));
      });
  });

export default inviteInvestor;
