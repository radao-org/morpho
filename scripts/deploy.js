const hre = require('hardhat')
const ethers = require('hardhat').ethers

async function main() {
  const [deployer, owner] = await ethers.getSigners()
  const fixedIrm = await hre.ethers.deployContract('FixedIrm', ['80000000000000000'], deployer)
  await fixedIrm.waitForDeployment()
  const fixedOracle = await hre.ethers.deployContract('FixedOracle', [owner.address], deployer)
  await fixedOracle.waitForDeployment()
  console.log({
    fixedIrm: fixedIrm.target,
    fixedOracle: fixedOracle.target
  })
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
