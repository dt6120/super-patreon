const web3 = require('./getweb3');
const Platform = require('./build/Platform.json');

const getContract = async () => {
    const networkId = await web3.eth.net.getId();
    const platformData = Platform.networks[networkId];

    if (platformData) {
        return new web3.eth.Contract(Platform.abi, platformData.address);
    } else {
        return new Error('Contract not deployed on current network');
    }
}

module.exports = getContract;
