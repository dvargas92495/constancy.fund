import type { Client } from "@dvargas92495/eversign";

const getEversign = () => {
  const Eversign = require("@dvargas92495/eversign").Client as typeof Client;
  return Promise.resolve(
    new Eversign(process.env.EVERSIGN_API_KEY || "", 398320)
  );
};

export default getEversign;
