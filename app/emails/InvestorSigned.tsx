import { Id } from "~/enums/paymentPreferences";
import paymentLabelsById from "~/_common/PaymentLabelsById";
import EmailLayout from "./EmailLayout";

const InvestorSigned = ({
  creatorName,
  investorName,
  investorPaymentPreferences,
  contractType,
  agreementUuid,
}: {
  creatorName: string;
  investorName: string;
  contractType: string;
  agreementUuid: string;
  investorPaymentPreferences: Record<Id, Record<string, string>>;
}) => {
  return (
    <EmailLayout>
      <p>Hi {creatorName},</p>
      <p>
        Congratulations! {investorName} has signed the {contractType} between
        the two of you.{" "}
        <a href={`${process.env.HOST}/contract?uuid=${agreementUuid}&signer=2`}>
          Click here
        </a>{" "}
        to sign the agreement.
      </p>
      <p>
        Once you sign, you will be able to eventually start sending returns back
        to the investor through one of their stated payment preferences:
      </p>
      <ul>
        {Object.keys(investorPaymentPreferences).map((p) => (
          <li key={p}>
            {paymentLabelsById[p as Id]}
            <ul>
              {Object.entries(investorPaymentPreferences[p as Id]).map(
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
      <hr />
      <p>
        You could ask the investor any questions by directly replying to this
        email.
      </p>
    </EmailLayout>
  );
};

export const render = (props: Parameters<typeof InvestorSigned>[0]) => (
  <InvestorSigned {...props} />
);

export default InvestorSigned;
