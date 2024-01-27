require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox")
require("./hardhat.tasks")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: process.env.PROVIDER_URL,
      accounts: [process.env.PK_DEPLOYER, process.env.PK_OWNER]
    }
  }
}
