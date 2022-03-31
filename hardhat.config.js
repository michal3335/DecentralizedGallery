require("@nomiclabs/hardhat-waffle");

const RINKEBY_PRIVATE_KEY = "cca2135e427f05e739378f22ec3a467b00aebf9df885a6f79c8445d34e6f6c55";

module.exports = {
  defaultNetwork: 'rinkeby',
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat:{
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/de8684b1dd7d4c169c6ba6285db885d0`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  },
  solidity:{
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }


};

