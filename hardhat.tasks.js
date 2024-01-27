require('dotenv').config()
const {task} = require('hardhat/config')

task('deployPPSOracle', 'Deploy a PPSOracle and optionally set the price')
  .addParam('loan', 'loan token address')
  .addParam('collateral', 'collateral token address')
  .addOptionalParam('price', 'price (per share, "1.42" for example: 1 COLLATERAL = 1.42 LOAN)')
  .setAction(async (args, hre) => {
    console.log(args)
    await wait()
    const {loan, collateral, price} = args

    const ethers = hre.ethers
    const [deployer] = await ethers.getSigners()
    const owner = await new ethers.Wallet(process.env.PK_OWNER).connect(ethers.provider);

    console.log({
      deployer: deployer.address,
      owner: owner.address
    })
    await wait()

    const getDecimals = async address => {
      return (await ethers.getContractAt([{
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }], address)).decimals()
    }

    const ppsOracle = await hre.ethers.deployContract('PPSOracle', [owner.address], deployer)
    await ppsOracle.waitForDeployment()

    if (price) {
      const loanDecimals = await getDecimals(loan)
      const collateralDecimals = await getDecimals(collateral)
      const newPrice = ethers.parseUnits(price, BigInt(36) + loanDecimals - collateralDecimals)
      await (await ppsOracle.connect(owner).setPrice(newPrice)).wait()
    }

    console.log({
      ppsOracle: {
        address: ppsOracle.target,
        price: price && (await ppsOracle.price()).toString()
      }
    })
  });
