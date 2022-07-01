import verifyAdminUser from "./verifyAdminUser.server";
import getConnection from "./mysql.server";
import apiInfuraIpfs from "./apiIpfsInfura.server";

const listRequests = (userId: string) =>
  verifyAdminUser(userId).then(() => {
    return getConnection().then((cxn) =>
      Promise.all([
        cxn
          .execute(`SELECT hash, contract FROM smart_contracts`)
          .then((res) => {
            return res as { hash: string; contract: string }[];
          }),
        apiInfuraIpfs<{
          Keys: Record<
            string,
            {
              Type: "recursive";
            }
          >;
        }>("pin/ls"),
        // deployed smart contracts also have an IPFS file within the contract deployed
        // will need to normalize into our own db to query efficiently
        // cxn
        //   .execute(
        //     `SELECT hash, address as contract FROM deployed_smart_contracts`
        //   )
        //   .then((res) => {
        //     return res as { hash: string; contract: string }[];
        //   }),
        // cxn
        //   .execute(
        //     `SELECT hash, address as contract FROM orphaned_smart_contracts`
        //   )
        //   .then((res) => {
        //     return res as { hash: string; contract: string }[];
        //   }),
      ]).then(
        ([
          hashes,
          pins,
          // deployed,
          // orphans,
        ]) => {
          cxn.destroy();
          const pinned = new Set(Object.keys(pins.Keys));
          return {
            files: hashes
              .map((h) => ({ ...h, type: "version" }))
              // .concat(deployed.map((h) => ({ ...h, type: "deployed" })))
              // .concat(orphans.map((h) => ({ ...h, type: "orphan" })))
              .map((h) => ({ ...h, pinned: pinned.has(h.hash) })),
          };
        }
      )
    );
  });

export default listRequests;
