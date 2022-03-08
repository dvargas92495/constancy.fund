import { users } from "@clerk/clerk-sdk-node";
import getPaymentPreferences from "./getPaymentPreferences.server";

const getUserProfile = (userId: string) =>
  Promise.all([users.getUser(userId), getPaymentPreferences(userId)]).then(
    ([u, paymentPreferences]) => {
      return {
        id: userId,
        completed: (u.publicMetadata?.completed as boolean) || false,
        contactEmail:
          (u.publicMetadata?.contactEmail as string) ||
          u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress ||
          "",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        middleName: (u.publicMetadata?.middleName as string) || "",
        companyName: (u.publicMetadata?.companyName as string) || "",
        questionaires: (u.publicMetadata?.questionaires as string[]) || [],
        socialProfiles: (u.publicMetadata?.socialProfiles as string[]) || [],
        attachDeck: (u.publicMetadata?.attachDeck as string) || "",
        demoVideo: (u.publicMetadata?.demoVideo as string) || "",
        registeredCountry:
          (u.publicMetadata?.registeredCountry as string) || "",
        companyRegistrationNumber:
          (u.publicMetadata?.companyRegistrationNumber as string) || "",
        companyAddressStreet:
          (u.publicMetadata?.companyAddressStreet as string) || "",
        companyAddressCity:
          (u.publicMetadata?.companyAddressCity as string) || "",
        companyAddressNumber:
          (u.publicMetadata?.companyAddressNumber as string) || "",
        companyAddressZip:
          (u.publicMetadata?.companyAddressZip as string) || "",
        paymentPreferences,
      };
    }
  );

export default getUserProfile;
