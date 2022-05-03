import getMysql from "./mysql.server";

const saveDeployedSmartContract = ({
  address,
  network,
  agreementUuid,
  hash,
}: {
  address: string;
  network: number;
  agreementUuid: string;
  hash: string;
}) => {
  return getMysql()
    .then(({ execute, destroy }) => {
      return execute(
        `INSERT INTO deployed_smart_contracts (uuid, address, network, agreement_uuid, hash) VALUES (UUID(), ?, ?, ?, ?)`,
        [address, network, agreementUuid, hash]
      ).then(() => destroy());
    })
    .then(() => ({ success: true }));
};

export default saveDeployedSmartContract;
