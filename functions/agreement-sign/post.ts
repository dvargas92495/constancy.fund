import sendEmail from "aws-sdk-plus/dist/sendEmail";
import createAPIGatewayProxyHandler from "aws-sdk-plus/dist/createAPIGatewayProxyHandler";
import prisma from "../_common/prisma";
import React from "react";
import { users } from "@clerk/clerk-sdk-node";
import EmailLayout from "../_common/EmailLayout";
import FUNDRAISE_TYPES from "../../db/fundraise_types";

const logic = ({
  agreementUuid,
  isInvestor,
}: {
  agreementUuid: string;
  isInvestor: boolean;
}) => {
  return prisma.eversignDocument
    .findFirst({
      where: { agreementUuid },
      select: {
        agreement: {
          select: {
            name: true,
            email: true,
            contract: {
              select: {
                userId: true,
                type: true,
              },
            },
          },
        },
        id: true,
      },
    })
    .then((a) =>
      users.getUser(a?.agreement?.contract?.userId || "").then((u) => ({
        investorEmail: a?.agreement.email,
        investorName: a?.agreement.name,
        userEmail:
          u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress || "",
        userName: `${u.firstName} ${u.lastName}`,
        documentId: a?.id,
        contractType: FUNDRAISE_TYPES[a?.agreement.contract.type || 0].name,
      }))
    )
    .then((r) =>
      isInvestor
        ? sendEmail({
            to: r.userEmail,
            replyTo: r.investorEmail,
            subject: `${r.investorName} has signed the agreement!`,
            body: React.createElement(
              EmailLayout,
              {},
              React.createElement("p", {}, `Hi ${r.userName},`),
              React.createElement(
                "p",
                {},
                `Congratulations! ${r.investorName} has signed the ${r.contractType} between the two of you.`,
                React.createElement(
                  "a",
                  {
                    href: `${process.env.HOST}/contract?id=${r.documentId}&signer=2`,
                  },
                  "Click here"
                ),
                ` to sign the agreement.`
              ),
              React.createElement("hr"),
              React.createElement(
                "p",
                {},
                `You could ask the investor any questions by directly replying to this email.`
              )
            ),
          })
        : sendEmail({
            to: r.investorEmail,
            replyTo: r.userEmail,
            subject: `${r.userName} has signed the agreement!`,
            body: React.createElement(
              EmailLayout,
              {},
              React.createElement("p", {}, `Hi ${r.investorName},`),
              React.createElement(
                "p",
                {},
                `Congratulations! Both you and ${r.userName} have signed the ${r.contractType}! You may begin sending them funds.`
              ),
              React.createElement("hr"),
              React.createElement(
                "p",
                {},
                `You could ask the creator any questions by directly replying to this email.`
              )
            ),
          })
    )
    .then(() => ({ success: true }));
};

export const handler = createAPIGatewayProxyHandler(logic);
export type Handler = typeof logic;
