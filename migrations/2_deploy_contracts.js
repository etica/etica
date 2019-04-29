var EticaBosoms = artifacts.require("./EticaBosoms.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaBosoms, "0x64f4Ceede08940292b4d36912F69edD65F9AB645");
};
