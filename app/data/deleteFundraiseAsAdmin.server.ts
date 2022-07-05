import deleteAgreementAsAdmin from "./deleteAgreementAsAdmin.server";
import getConnection from "./mysql.server";
import verifyAdminUser from "./verifyAdminUser.server";

const deleteFundraiseAsAdmin = ({ userId }: { userId: string }) => {
  return verifyAdminUser(userId)
    .then(() => getConnection())
    .then((cxn) =>
      Promise.all([
        cxn.execute(
          `DELETE d FROM contractdetail d 
      INNER JOIN contract c ON c.uuid = d.contractUuid 
      WHERE c.userId = ?`,
          [userId || ""]
        ),
        cxn
          .execute(
            `SELECT a.uuid FROM contract c 
          INNER JOIN agreement a ON c.uuid = a.contractUuid
WHERE c.userId = ?`,
            [userId || ""]
          )
          .then((res) =>
            Promise.all(
              (res as { uuid: string }[]).map((r) =>
                deleteAgreementAsAdmin({ uuid: r.uuid, userId })
              )
            )
          ),
        cxn.execute(
          `DELETE a FROM contractclause a 
      INNER JOIN contract c ON c.uuid = a.contractUuid 
      WHERE c.userId = ?`,
          [userId || ""]
        ),
      ])
        .then(() =>
          cxn.execute(`DELETE FROM contract WHERE userId = ?`, [userId || ""])
        )
        .then(() => cxn.destroy())
    );
};

export default deleteFundraiseAsAdmin;
