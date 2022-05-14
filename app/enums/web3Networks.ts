const MAINNET_NETWORK_ID = 0x1;
const KOVAN_NETWORK_ID = 0x2a;
const ROPSTEN_NETWORK_ID = 0x3;
const RINKEBY_NETWORK_ID = 0x4;
const GOERLI_NETWORK_ID = 0x5;
const OPTIMISM_NETWORK_ID = 10;
const OPTIMISM_KOVAN_NETWORK_ID = 69;
const ARBITRUM_TEST_NETWORK_ID = 421611;
const ARBITRUM_NETWORK_ID = 42161;
const POLYGON_MAIN_NETWORK_ID = 137;
const POLYGON_TEST_NETWORK_ID = 80001;
const LOCALHOST_NETWORK_ID = 0x7a69;

export const infuraEthersProvidersById: {
  [id: number]: string;
} = {
  [LOCALHOST_NETWORK_ID]: "localhost",
  [KOVAN_NETWORK_ID]: "kovan",
  [ROPSTEN_NETWORK_ID]: "ropsten",
  [MAINNET_NETWORK_ID]: "homestead",
  [RINKEBY_NETWORK_ID]: "rinkeby",
  [OPTIMISM_NETWORK_ID]: "optimism",
  [OPTIMISM_KOVAN_NETWORK_ID]: "optimism-kovan",
  [POLYGON_MAIN_NETWORK_ID]: "matic",
  [POLYGON_TEST_NETWORK_ID]: "maticmum",
  [GOERLI_NETWORK_ID]: "goerli",
  [ARBITRUM_TEST_NETWORK_ID]: "arbitrum-rinkeby",
  [ARBITRUM_NETWORK_ID]: "arbitrum",
};

export const displayNameById: {
  [id: number]: string;
} = {
  [LOCALHOST_NETWORK_ID]: "Hardhat",
  [KOVAN_NETWORK_ID]: "Kovan",
  [ROPSTEN_NETWORK_ID]: "Ropsten",
  [MAINNET_NETWORK_ID]: "Mainnet",
  [RINKEBY_NETWORK_ID]: "Rinkeby",
  [OPTIMISM_NETWORK_ID]: "Optimism",
  [OPTIMISM_KOVAN_NETWORK_ID]: "Optimism Kovan",
  [POLYGON_MAIN_NETWORK_ID]: "Polygon",
  [POLYGON_TEST_NETWORK_ID]: "Polygon Mumbai",
  [GOERLI_NETWORK_ID]: "Goerli",
  [ARBITRUM_TEST_NETWORK_ID]: "Arbitrum Rinkeby",
  [ARBITRUM_NETWORK_ID]: "Arbitrum",
};
