import EmailLayout from "./EmailLayout";
import paymentLabelsById from "../_common/PaymentLabelsById";
import { Id } from "../enums/paymentPreferences";
import formatAmount from "../util/formatAmount";

const CreatorSigned = ({
  investorName,
  creatorName,
  contractType,
  creatorPaymentPreferences,
  contractDetails,
  agreementAmount,
}: {
  investorName: string;
  creatorName: string;
  contractType: string;
  creatorPaymentPreferences: Record<Id, Record<string, string>>;
  contractDetails: Record<string, string>;
  agreementAmount: number;
}) => {
  return (
    <EmailLayout>
      <p>Hi {investorName},</p>
      <p>
        Congratulations! Both you and {creatorName} have signed the{" "}
        {contractType}! You may begin sending them funds through one of the
        viable payment preferences below:
      </p>
      <ul>
        {Object.keys(creatorPaymentPreferences).map((p) => (
          <li key={p}>
            {paymentLabelsById[p as Id]}
            <ul>
              {Object.entries(creatorPaymentPreferences[p as Id]).map(
                ([key, value]) => (
                  <li key={key}>
                    <b>{key}:</b> {value}
                  </li>
                )
              )}
            </ul>
          </li>
        ))}
      </ul>
      <p>
        As per the agreement, you should send them ${agreementAmount}, paid out{" "}
        {contractDetails.supportType === "once" && "as a one-time lump sum."}
        {contractDetails.supportType === "monthly" &&
          `as a $${formatAmount(
            agreementAmount / Number(contractDetails.frequency || 1)
          )} monthly stipend paid for ${Number(
            contractDetails.frequency || 1
          )} months.`}
      </p>
      <hr />
      <p>
        You could ask the creator any questions by directly replying to this
        email.
      </p>
    </EmailLayout>
  );
};

export const render = (props: Parameters<typeof CreatorSigned>[0]) => (
  <CreatorSigned {...props} />
);

export default CreatorSigned;
