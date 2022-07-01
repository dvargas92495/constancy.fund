import axios from "axios";
import type { Execute } from "./mysql.server";
import type { ContractInterface } from "ethers";
import apiInfuraIpfs from "./apiIpfsInfura.server";

const getEthereumAbiByFundraiseType = (type: string, execute: Execute) =>
  execute(
    `SELECT hash FROM smart_contracts WHERE contract = ? ORDER BY version DESC LIMIT 1`,
    [type]
  )
    .then((records) => records as { hash: string }[])
    .then(([{ hash }]) =>
      apiInfuraIpfs<string>(`get?arg=${hash}`).then((res) => ({
        ...(JSON.parse(res) as { abi: ContractInterface; bytecode: string }),
        versionHash: hash,
      }))
    );

export default getEthereumAbiByFundraiseType;
