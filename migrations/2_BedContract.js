var BedContract = artifacts.require("BedContract");

module.exports = function(deployer) {
  const name = "BedContract";
  const money = 1000000000;
  deployer.deploy(BedContract, name, money);
};
