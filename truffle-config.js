/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');

require('dotenv').config()

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  contracts_directory: './contracts',
  contracts_build_directory: './src/ethereum/build',

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },

    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, 
        process.env.ROPSTEN_PROVIDER_URL
      ),
      network_id: 3
    },

    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.RINKEBY_PROVIDER_URL
      ),
      network_id: 4
    },

    goerli: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.GOERLI_PROVIDER_URL
      ),
      network_id: 5
    },

    kovan: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.KOVAN_PROVIDER_URL
      ),
      network_id: 42
    },

    matic_testnet: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        process.env.MATIC_PROVIDER_URL
      ),
      network_id: 80001
    }
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.7.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
