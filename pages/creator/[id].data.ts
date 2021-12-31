import { users } from "@clerk/clerk-sdk-node";
import formatError from "@dvargas92495/api/formatError";

export type Props = {
  fullName: string;
  email: string;
  profileImageUrl: string;
  socialProfiles: string[];
  questionaires: string[];
};

const getStaticProps = ({
  params: { id },
}: {
  params: { id: string };
}): Promise<{
  props: Props;
}> => {
  return users
    .getUser(id)
    .then((u) => ({
      props: {
        fullName: `${u.firstName} ${
          typeof u.publicMetadata.middleName === "string"
            ? `${u.publicMetadata.middleName.slice(0, 1)}. `
            : ""
        }${u.lastName}`,
        email:
          u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress || "",
        profileImageUrl: u.profileImageUrl || "",
        socialProfiles: u.publicMetadata.socialProfiles as string[],
        questionaires: u.publicMetadata.questionaires as string[],
      },
    }))
    .catch((e) => {
      throw new Error(formatError(e));
    });
};

export default getStaticProps;
