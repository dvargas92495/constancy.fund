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
                  doc.getIsDraft() || doc.getIsCancelled()
                    ? eversign.deleteDocument(doc, "").catch((err) => {
                        throw new Error(
                          `Failed to delete draft document https://crowdinvestinme.eversign.com/documents/${e.id}\nReason: ${err}`
                        );
                      })
                    : eversign
                        .cancelDocument(doc)
                        .catch((err) => {
                          throw new Error(
                            `Failed to cancel document https://crowdinvestinme.eversign.com/documents/${e.id}\nReason: ${err}`
                          );
                        })
                        .then((r) =>
                          eversign.deleteDocument(doc, "").catch((err) => {
                            throw new Error(
                              `Failed to delete document https://crowdinvestinme.eversign.com/documents/${e.id}\nReason: ${err}\nResponse From Cancel: ${r}`
                            );
                          })
                        )
                )
                .then(() =>
                  execute(
                    `DELETE FROM eversigndocument
              WHERE id = ?`,
                    [e.id]
                  )
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
