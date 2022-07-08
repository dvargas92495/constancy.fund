import type { User } from "@clerk/clerk-sdk-node";

const getClerkName = (u: User) => {
  const middleName = (u.publicMetadata?.middleName as string) || "";
  if (u.firstName && u.lastName)
    return `${u.firstName} ${middleName ? `${middleName.slice(0, 1)}. ` : ""}${
      u.lastName
    }`;
  if (u.lastName) return u.lastName;
  if (u.firstName)
    return `${u.firstName}${middleName ? ` ${middleName.slice(0, 1)}.` : ""}`;
  return "Anonymous";
};

export default getClerkName;
