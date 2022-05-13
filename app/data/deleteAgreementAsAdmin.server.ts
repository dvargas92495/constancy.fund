import getMysql from "../../app/data/mysql.server";
import verifyAdminUser from "./verifyAdminUser.server";
import getEversign from "./eversign.server";

const deleteAgreementAsAdmin = ({
  uuid,
  userId,
}: {
  uuid: string;
  userId: string;
}) =>
  verifyAdminUser(userId)
    .then(() => Promise.all([getMysql(), getEversign()]))
    .then(([{ execute, destroy }, eversign]) => {
      return execute(
        `SELECT e.id 
     FROM eversigndocument e
     WHERE e.agreementUuid = ?`,
        [uuid]
      )
        .then(async (eversigns) => {
          return Promise.all(
            (eversigns as { id: string }[]).map((e) =>
              eversign
                .getDocumentByHash(e.id)
                .then((doc) =>
                  doc.getIsDraft()
                    ? eversign.deleteDocument(doc, "")
                    : eversign
                        .cancelDocument(doc)
                        .then(() => eversign.deleteDocument(doc, ""))
                )
            )
          );
        })
        .then(() => {
          return execute(
            `DELETE FROM agreement
        WHERE uuid = ?`,
            [uuid]
          ).then(() => destroy());
        })
        .then(() => ({ success: true }));
    });

export default deleteAgreementAsAdmin;
