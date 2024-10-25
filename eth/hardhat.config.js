require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { INFURA_ENDPOINT, MNEMONIC } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    sepolia: {
      url: INFURA_ENDPOINT,
      accounts: { mnemonic: MNEMONIC },
    },
  },
};
