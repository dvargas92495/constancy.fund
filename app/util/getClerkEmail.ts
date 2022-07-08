import type { User } from "@clerk/clerk-sdk-node";

const getClerkEmail = (u: User) =>
  (u.publicMetadata?.contactEmail as string) ||
  u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
    ?.emailAddress ||
  "";

export default getClerkEmail;
