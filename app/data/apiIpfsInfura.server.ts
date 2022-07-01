import axios from "axios";
import FormData from "form-data";

const apiInfuraIpfs = <T = any>(
  path: string,
  data: Record<string, string | Buffer> = {}
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([k, v]) => formData.append(k, v));
  const Authorization = `Basic ${Buffer.from(
    `${process.env.IPFS_INFURA_ID}:${process.env.IPFS_INFURA_SECRET}`
  ).toString("base64")}`;
  return axios
    .post<T>(`https://ipfs.infura.io:5001/api/v0/${path}`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization,
      },
    })
    .then((r) => r.data);
};

export default apiInfuraIpfs;
