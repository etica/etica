var EticaToken = artifacts.require("./EticaToken.sol");
var EticaRelease = artifacts.require("./EticaRelease.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaToken);
  deployer.deploy(EticaRelease);
//  deployer.deploy(EticaToken, "0x64f4Ceede08940292b4d36912F69edD65F9AB645");
};
