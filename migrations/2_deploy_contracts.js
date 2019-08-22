var EticaRelease = artifacts.require("./EticaRelease.sol");
var EticaReleaseProtocolTestDynamics = artifacts.require("./EticaReleaseProtocolTestDynamics.sol");
var EticaReleaseProtocolTest = artifacts.require("./EticaReleaseProtocolTest.sol");
var EticaReleaseProtocolTestPhase2 = artifacts.require("./EticaReleaseProtocolTestPhase2.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaRelease);
  deployer.deploy(EticaReleaseProtocolTest);
  deployer.deploy(EticaReleaseProtocolTestPhase2);
  deployer.deploy(EticaReleaseProtocolTestDynamics);
};
