import clerkAuthenticateLambda from "@dvargas92495/api/clerkAuthenticateLambda";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import { MethodNotAllowedError, NotFoundError } from "aws-sdk-plus/dist/errors";
import type { User } from "@clerk/clerk-sdk-node";
import { execute } from "./mysql.server";
import sendEmail from "aws-sdk-plus/dist/sendEmail";
import { render } from "../emails/InvitationToFund";
import { v4 } from "uuid";

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
}) => {
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
    .then((agreementUuid) =>
      sendEmail({
        to: email,
        replyTo:
          user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
            ?.emailAddress || undefined,
        subject: `Invitation to fund ${user.firstName} ${user.lastName}`,
        body: render({
          investorName: name,
          creatorName: `${user.firstName} ${user.lastName}`,
          creatorId: user.id || "",
          agreementUuid,
        }),
      }).then(() => ({ uuid: agreementUuid }))
    );
};

export default inviteInvestor;
