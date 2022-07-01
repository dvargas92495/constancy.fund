import apiInfuraIpfs from "./apiIpfsInfura.server";

const uploadToIpfs = ({ file }: { file: Buffer }) => {
  return apiInfuraIpfs<{ Hash: string }>("add", { files: file }).then((r) =>
    apiInfuraIpfs(`pin/add?arg=${r.Hash}`, {}).then(() => r.Hash)
  );
};

export default uploadToIpfs;
