// Allows us to use ES6 in our migrations and tests.
require('babel-register')

var HDWalletProvider = require("truffle-hdwallet-provider");

var infura_apikey = process.env.INFURA_APIKEY;
var mnemonic = process.env.METAMASK_MNEMONIC;
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    }
  }
}
