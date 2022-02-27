import { users } from "@clerk/clerk-sdk-node";

const saveUserProfile = (userId: string, data: Record<string, string[]>) =>
  users.getUser(userId).then((user) =>
    users.updateUser(userId, {
      firstName: data.firstName[0],
      lastName: data.lastName[0],
      publicMetadata: {
        ...user.publicMetadata,
        companyName: data.companyName[0],
        completed: true,
        contactEmail: data.contactEmail[0],
        questionaires: data.questionaires,
        socialProfiles: data.socialProfiles,
        attachDeck: data.attachDeck[0],
        registeredCountry: data.registeredCountry[0],
        companyRegistrationNumber: data.companyRegistrationNumber[0],
        companyAddressStreet: data.companyAddressStreet[0],
        companyAddressCity: data.companyAddressCity[0],
        companyAddressNumber: data.companyAddressNumber[0],
        companyAddressZip: data.companyAddressZip[0],
        paymentPreference: {
          type: data.paymentPreferenceType[0],
          ...Object.fromEntries(
            Object.keys(data)
              .filter((k) => k.startsWith("paymentPreference"))
              .map((k) => {
                const newKey = k.replace(/^paymentPreference/, "");
                return [
                  `${newKey.slice(0, 1).toLowerCase()}${newKey.slice(1)}`,
                  data[k][0],
                ];
              })
          ),
        },
      },
    })
  );

export default saveUserProfile;
