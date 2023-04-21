var MyToken = artifacts.require("MyToken");

module.exports = function(deployer) {
  const name = "My Token";
  const symbol = "MTK";
  const totalSupply = 1000000000;
  deployer.deploy(MyToken, name, symbol, totalSupply);
};
