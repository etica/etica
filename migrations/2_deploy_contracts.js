var EticaRelease= artifacts.require("./EticaRelease.sol");
var EticaReleaseMining= artifacts.require("./EticaReleaseMining.sol");

module.exports = function(deployer) {
  deployer.deploy(EticaRelease);
  deployer.deploy(EticaReleaseMining);
};