import EmailLayout from "./EmailLayout";

const CreatorSigned = ({
  investorName,
  creatorName,
  contractType,
}: {
  investorName: string;
  creatorName: string;
  contractType: string;
}) => {
  return (
    <EmailLayout>
      <p>Hi {investorName},</p>
      <p>
        Congratulations! Both you and {creatorName} have signed the $
        {contractType}! You may begin sending them funds.
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
