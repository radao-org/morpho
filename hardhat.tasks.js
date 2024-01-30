require('dotenv').config()
const {task} = require('hardhat/config')

task('deployPPSOracle', 'Deploy a PPSOracle and optionally set the price')
  .addParam('loan', 'loan token address')
  .addParam('collateral', 'collateral token address')
  .addOptionalParam('price', 'price (per share, "1.42" for example: 1 COLLATERAL = 1.42 LOAN)')
  .setAction(async (args, {ethers}) => {
    const networkName = (await ethers.provider.getNetwork()).name
    console.log('network name:', networkName)
    console.log('args:', args)
    const {loan, collateral, price} = args

    const [deployer, owner] = networkName === 'env'
      ? [
        await new ethers.Wallet(process.env.PK_DEPLOYER).connect(ethers.provider),
        await new ethers.Wallet(process.env.PK_OWNER).connect(ethers.provider)
      ]
      : await ethers.getSigners()

    console.log({
      deployer: deployer.address,
      owner: owner.address
    })

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
    console.log('ppsOracle address:', ppsOracle.target)

    if (price) {
      const loanDecimals = await getDecimals(loan)
      const collateralDecimals = await getDecimals(collateral)
      console.log('decimals: ', {
        loanDecimals: loanDecimals.toString(),
        collateralDecimals: collateralDecimals.toString()
      })
      const newPrice = ethers.parseUnits(price, BigInt(36) + loanDecimals - collateralDecimals)
      await (await ppsOracle.connect(owner).setPrice(newPrice)).wait()
      console.log('price: ', (await ppsOracle.price()).toString())
    }
  });
