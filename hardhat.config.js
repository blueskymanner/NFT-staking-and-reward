require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require('hardhat-gas-reporter');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const PRIVATE_KEY = process.env.PRIVATE_KEY;
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

  mocha: {
    timeout: 20000
  },

  gasReporter: {
    currency: 'USD',
    enabled: false,
    gasPrice: 50,
  },

  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/084e5c1f291642d5a9cffad25a1954c8`,
      chainId: 1,
      
      accounts: [`0x${PRIVATE_KEY}`]
    },

    kovan: {
      url: `https://kovan.infura.io/v3/084e5c1f291642d5a9cffad25a1954c8`,
      chainId: 42,

      accounts: [`0x${PRIVATE_KEY}`],
    },

    rinkeby: {
      url: `https://rinkeby.infura.io/v3/084e5c1f291642d5a9cffad25a1954c8`,
      chainId: 4,
      
      accounts: [`0x${PRIVATE_KEY}`],
    },

    ropsten: {
      url: `https://ropsten.infura.io/v3/084e5c1f291642d5a9cffad25a1954c8`,
      chainId: 3,
      
      accounts: [`0x${PRIVATE_KEY}`],
    },

    localhost: {
      url: `http://127.0.0.1:8545`
    },
  },
};
