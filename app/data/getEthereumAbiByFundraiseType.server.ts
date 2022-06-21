import axios from "axios";
import type { Execute } from "./mysql.server";
import type { ContractInterface } from "ethers";

const getEthereumAbiByFundraiseType = (type: string, execute: Execute) =>
  execute(
    `SELECT hash FROM smart_contracts WHERE contract = ? ORDER BY version DESC LIMIT 1`,
    [type]
  )
    .then((records) => records as { hash: string }[])
    .then(([{ hash }]) =>
      axios
        .get<{ abi: ContractInterface; bytecode: string }>(
          `https://ipfs.io/ipfs/${hash}`
        )
        .then((res) => ({ ...res.data, versionHash: hash }))
    );

export default getEthereumAbiByFundraiseType;
