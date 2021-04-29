const Web3 = require('web3');
require('dotenv').config({ path: 'D:\\dhruv\\Desktop\\super\\.env' });

console.log(process.env.MNEMONIC);

if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
} else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
} else {
    window.web3 = new Web3('http://localhost:8545');
}

module.exports = window.web3;
// module.exports = new Web3('http://localhost:8545');
// module.exports = new Web3(process.env.LOCALHOST_URL);
// module.exports =  new Web3(process.env.GOERLI_PROVIDER_URL);
