import EmailLayout from "./EmailLayout";

const InvestorSigned = ({
  creatorName,
  investorName,
  contractType,
  agreementUuid,
}: {
  creatorName: string;
  investorName: string;
  contractType: string;
  agreementUuid: string;
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
