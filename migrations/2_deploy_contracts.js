const Platform = artifacts.require("Platform");

module.exports = async (deployer) => {
    deployer.deploy(Platform);
}
