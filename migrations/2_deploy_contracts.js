var EticaTokenUniqueTest = artifacts.require("./EticaTokenUniqueTest.sol");
var EticaRelease = artifacts.require("./EticaRelease.sol");
var EticaReleaseProtocolTest = artifacts.require("./EticaReleaseProtocolTest.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaTokenUniqueTest);
  deployer.deploy(EticaRelease);
  deployer.deploy(EticaReleaseProtocolTest);
//  deployer.deploy(EticaToken, "0x64f4Ceede08940292b4d36912F69edD65F9AB645");
};
