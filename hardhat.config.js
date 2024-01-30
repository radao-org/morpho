require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox")
require("./hardhat.tasks")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    env: {
      url: process.env.PROVIDER_URL
    }
  }
}
