require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.4",
  // hardhat: {
  //   chainId: 31337
  // },
  paths: {
    artifacts: "./client/artifacts",
  },
  defaultNetwork: "c4ei",
  networks: {
    c4ei: {
      url: "https://rpc.c4ei.net",
      accounts: [process.env.PK],
      chainId: 21004
    },
    klay: {
      url: "https://public-node-api.klaytnapi.com/v1/cypress",
      accounts: [process.env.PK],
      chainId: 8217
    }
  },
};
