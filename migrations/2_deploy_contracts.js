var EticaToken = artifacts.require("./EticaToken.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaToken);
//  deployer.deploy(EticaToken, "0x64f4Ceede08940292b4d36912F69edD65F9AB645");
};
