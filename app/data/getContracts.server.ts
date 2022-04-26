import getMysql from "./mysql.server";

const getContracts = ({
  userId,
}: {
  userId?: string | null;
}): Promise<{ contracts: { id: string, agreementUuid: string }[] }> => {
  if (!userId) return Promise.resolve({ contracts: [] });
  return getMysql().then(({ execute }) =>
    execute(
      `SELECT e.* FROM eversigndocument e
    INNER JOIN agreement a ON e.agreementUuid = a.uuid
    INNER JOIN contract c ON a.contractUuid = c.uuid
    WHERE c.userId = ?`,
      [userId]
    ).then((contracts) => {
      return { contracts: contracts as { id: string; agreementUuid: string }[] };
    })
  );
};

export default getContracts;
