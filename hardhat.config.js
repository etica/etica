require("@nomicfoundation/hardhat-toolbox");
require('hardhat-storage-layout');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50000000,
      },
    },
  },
  networks: {
    crucible: {
      gas:"auto",
      gasPrice:"auto",
      url:"", // rpc end point, example: http://localhost:8545, http://153.218.102.227:8545
      chainId:61888, // 61888: Crucible testnet
      accounts: [""] // Enter a private key for deployment
 }
  }
};
