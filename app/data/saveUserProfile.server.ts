import { users } from "@clerk/clerk-sdk-node";

const saveUserProfile = (userId: string, data: Record<string, string[]>) => {
  if (!data.firstName[0]) {
    throw new Error("`firstName` is required.");
  } else if (!data.lastName[0]) {
    throw new Error("`lastName` is required.");
  } else if (!data.companyName[0]) {
    throw new Error("`companyName` is required.");
  } else if (!data.contactEmail[0]) {
    throw new Error("`contactEmail` is required.");
  } else if (!data.registeredCountry[0]) {
    throw new Error("`registeredCountry` is required.");
  } else if (!data.companyRegistrationNumber[0]) {
    throw new Error("`companyRegistrationNumber` is required.");
  } else if (!data.companyAddressStreet[0]) {
    throw new Error("`companyAddressStreet` is required.");
  } else if (!data.companyAddressCity[0]) {
    throw new Error("`companyAddressCity` is required.");
  } else if (!data.companyAddressNumber[0]) {
    throw new Error("`companyAddressNumber` is required.");
  } else if (!data.companyAddressZip[0]) {
    throw new Error("`companyAddressZip` is required.");
  } else if (!data.paymentPreferenceType[0]) {
    throw new Error("`paymentPreferenceType` is required.");
  } else if (
    !data.socialProfiles.every((sp) => !sp || sp.startsWith("https://"))
  ) {
    throw new Error("One of your social profiles have an invalid URL");
  }
  return users.getUser(userId).then((user) =>
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
};

export default saveUserProfile;
