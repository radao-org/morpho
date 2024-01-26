const hre = require('hardhat')
const ethers = require('hardhat').ethers

async function main() {
  const [deployer, owner] = await ethers.getSigners()

  const ppsOracle = await hre.ethers.deployContract('PPSOracle', [owner.address], deployer)
  await ppsOracle.waitForDeployment()

  // 1 COLLATERAL = 42 LOAN
  const collateralDecimals = 6
  const loanDecimals = 18
  const price = ethers.parseUnits('42', 36 + loanDecimals - collateralDecimals)
  await (await ppsOracle.connect(owner).setPrice(price)).wait()

  console.log({
    ppsOracle: {
      address: ppsOracle.target,
      price: await ppsOracle.price()
    }
  })
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)
  process.exit(1)
})
