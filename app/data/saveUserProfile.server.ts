import { users } from "@clerk/clerk-sdk-node";
import { dbTypeById } from "~/enums/paymentPreferences";
import validatePaymentPreferences from "~/data/validatePaymentPreferences";
import getMysql from "./mysql.server";
import getPaymentPreferences from "./getPaymentPreferences.server";
import { v4 } from "uuid";

const saveUserProfile = (userId: string, data: Record<string, string[]>) => {
  if (!data.firstName?.[0]) {
    throw new Error("`firstName` is required.");
  } else if (!data.lastName?.[0]) {
    throw new Error("`lastName` is required.");
  } else if (!data.companyName?.[0]) {
    throw new Error("`companyName` is required.");
  } else if (!data.contactEmail?.[0]) {
    throw new Error("`contactEmail` is required.");
  } else if (!data.registeredCountry?.[0]) {
    throw new Error("`registeredCountry` is required.");
  } else if (!data.companyRegistrationNumber?.[0]) {
    throw new Error("`companyRegistrationNumber` is required.");
  } else if (!data.companyAddressStreet?.[0]) {
    throw new Error("`companyAddressStreet` is required.");
  } else if (!data.companyAddressCity?.[0]) {
    throw new Error("`companyAddressCity` is required.");
  } else if (!data.companyAddressNumber?.[0]) {
    throw new Error("`companyAddressNumber` is required.");
  } else if (!data.companyAddressZip?.[0]) {
    throw new Error("`companyAddressZip` is required.");
  } else if (
    !(data.socialProfiles || []).every((sp) => !sp || sp.startsWith("https://"))
  ) {
    throw new Error("One of your social profiles have an invalid URL");
  }
  const paymentPreferences = validatePaymentPreferences(data);
  const { execute, destroy } = getMysql();
  return Promise.all([
    users.getUser(userId),
    getPaymentPreferences(userId, execute),
  ]).then(([user, oldPP]) => {
    const updatedPP = Object.fromEntries(
      paymentPreferences.map(([k, v]) => [k, Object.fromEntries(v)])
    );
    const paymentPreferencesToDelete = Object.keys(oldPP).filter(
      (key) => !updatedPP[key]
    );
    const paymentPreferencesToInsert = Object.keys(updatedPP)
      .filter((key) => !oldPP[key])
      .map((key) => ({
        type: dbTypeById[key].toString(),
        uuid: v4(),
        fields: updatedPP[key],
      }));
    const paymentPreferencesToUpdate = Object.keys(updatedPP)
      .filter((key) => !!oldPP[key])
      .map((key) => ({
        type: dbTypeById[key].toString(),
        fields: updatedPP[key],
      }));
    return Promise.all([
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
        },
      }),
      ...(paymentPreferencesToDelete.length
        ? [
            execute(
              `DELETE FROM paymentpreferencedetail d
        INNER JOIN paymentpreference p ON p.uuid = d.paymentPreferenceUuid
        WHERE p.type IN (${paymentPreferencesToDelete
          .map(() => "?")
          .join(",")}) AND p.userId = ?`,
              paymentPreferencesToDelete
                .map((key) => dbTypeById[key].toString())
                .concat(userId)
            ).then(() =>
              execute(
                `DELETE FROM paymentpreference 
            WHERE p.type IN (${paymentPreferencesToDelete
              .map(() => "?")
              .join(",")}) AND p.userId = ?`,
                paymentPreferencesToDelete
                  .map((key) => dbTypeById[key].toString())
                  .concat(userId)
              )
            ),
          ]
        : []),
      ...(paymentPreferencesToInsert.length
        ? [
            execute(
              `INSERT INTO paymentpreference (uuid, type, userId)
              VALUES ${paymentPreferencesToInsert.map(() => `(?,?,?)`)}`,
              paymentPreferencesToInsert.flatMap(({ type, uuid }) => [
                uuid,
                type,
                userId,
              ])
            ).then(() =>
              execute(
                `INSERT INTO paymentpreferencedetail (uuid, label, value, paymentPreferenceUuid)
                VALUES ${paymentPreferencesToInsert
                  .flatMap(({ fields }) =>
                    Object.keys(fields).map(() => `(?,?,?,?)`)
                  )
                  .join(",")}`,
                paymentPreferencesToInsert
                  .flatMap(({ uuid, fields }) =>
                    Object.entries(fields).map(([label, value]) => [
                      v4(),
                      label,
                      value,
                      uuid,
                    ])
                  )
                  .flat()
              )
            ),
          ]
        : []),
      ...(paymentPreferencesToUpdate.length
        ? [
            execute(
              `UPDATE paymentpreferencedetail d
                    INNER JOIN paymentpreference p ON d.paymentPreferenceUuid = p.uuid
                    SET value = (case ${paymentPreferencesToUpdate.flatMap(
                      ({ fields }) =>
                        Object.keys(fields).map(
                          () => "WHEN d.label = ? AND p.type = ? THEN ?"
                        )
                    )} end)
                    WHERE p.type IN (${paymentPreferencesToUpdate
                      .map(() => "?")
                      .join(",")}) AND p.userId = ?`,
              paymentPreferencesToUpdate
                .flatMap(({ fields, type }) =>
                  Object.entries(fields).map(([label, value]) => [
                    label,
                    type,
                    value,
                  ])
                )
                .flat()
                .concat(paymentPreferencesToUpdate.map((p) => p.type))
                .concat([userId])
            ),
          ]
        : []),
    ]).then(destroy);
  });
};

export default saveUserProfile;
