import getClerkEmail from "~/util/getClerkEmail";
import getClerkName from "~/util/getClerkName";
import getPaymentPreferences from "./getPaymentPreferences.server";
import type { Execute } from "./mysql.server";

const getUserProfile = (userId: string, execute?: Execute) =>
  Promise.all([
    import("@clerk/clerk-sdk-node").then((clerk) =>
      clerk.users.getUser(userId)
    ),
    getPaymentPreferences(userId, execute),
  ]).then(([u, paymentPreferences]) => {
    return {
      id: userId,
      completed: (u.publicMetadata?.completed as boolean) || false,
      contactEmail: getClerkEmail(u),
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      name: getClerkName(u),
      middleName: (u.publicMetadata?.middleName as string) || "",
      profileImageUrl: u.profileImageUrl,
      companyName: (u.publicMetadata?.companyName as string) || "",
      questionaires:
        (u.publicMetadata?.questionaires as Record<string, string>) || [],
      socialProfiles: (u.publicMetadata?.socialProfiles as string[]) || [],
      attachDeck: (u.publicMetadata?.attachDeck as string) || "",
      demoVideo: (u.publicMetadata?.demoVideo as string) || "",
      registeredCountry: (u.publicMetadata?.registeredCountry as string) || "",
      companyRegistrationNumber:
        (u.publicMetadata?.companyRegistrationNumber as string) || "",
      companyAddressStreet:
        (u.publicMetadata?.companyAddressStreet as string) || "",
      companyAddressCity:
        (u.publicMetadata?.companyAddressCity as string) || "",
      companyAddressNumber:
        (u.publicMetadata?.companyAddressNumber as string) || "",
      companyAddressZip: (u.publicMetadata?.companyAddressZip as string) || "",
      representativeAddressStreet:
        (u.publicMetadata?.representativeAddressStreet as string) || "",
      representativeAddressNumber:
        (u.publicMetadata?.representativeAddressNumber as string) || "",
      representativeAddressCity:
        (u.publicMetadata?.representativeAddressCity as string) || "",
      representativeAddressZip:
        (u.publicMetadata?.representativeAddressZip as string) || "",
      paymentPreferences,
    };
  });

export default getUserProfile;
