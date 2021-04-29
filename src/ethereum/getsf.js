const SuperfluidSDK = require('@superfluid-finance/js-sdk');
const web3 = require('./getweb3');

const sf = new SuperfluidSDK.Framework({
    web3Provider: web3.currentProvider,
    version: 'v1',
    tokens: ['fDAI']
});

module.exports = sf;
