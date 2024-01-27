const {loadFixture,} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {expect} = require('chai')

const PRICE = 42

describe('PPSOracle', function () {
  async function deployFixture() {
    const [deployer, owner] = await ethers.getSigners()
    const ppsOracle = await (await ethers.getContractFactory('PPSOracle')).deploy(owner.address)
    return {deployer, owner, ppsOracle}
  }

  async function initFixture() {
    const context = await loadFixture(deployFixture)
    const {owner, ppsOracle} = context
    await ppsOracle.connect(owner).setPrice(PRICE)
    return context
  }

  describe('Deployment', function () {
    it('Should set the price to 0, reverting on price', async function () {
      const {ppsOracle} = await loadFixture(deployFixture)
      await expect(ppsOracle.price()).revertedWithoutReason()
    })

    it('Should set the owner', async function () {
      const {owner, ppsOracle} = await loadFixture(deployFixture)
      expect(await ppsOracle.owner()).to.equal(owner.address)
    })
  })

  describe('Set price', function () {
    it('Should set a new price (owner)', async function () {
      const {owner, ppsOracle} = await loadFixture(initFixture)
      const newPrice = 24
      await expect(await ppsOracle.connect(owner).setPrice(newPrice))
        .emit(ppsOracle, "SetPrice").withArgs(PRICE, newPrice)
      expect(await ppsOracle.price()).to.equal(newPrice)
    })

    it(`Should don't set a new price (not owner)`, async function () {
      const {deployer, ppsOracle} = await loadFixture(initFixture)
      const price = 24
      const response = ppsOracle.connect(deployer).setPrice(price)
      await expect(response).revertedWithCustomError(ppsOracle, 'OwnableUnauthorizedAccount')
    })

    it('Should revert on price if 0', async function () {
      const {owner, ppsOracle} = await loadFixture(initFixture)
      await ppsOracle.connect(owner).setPrice(0)
      await expect(ppsOracle.price()).revertedWithoutReason()
    })
  })

  describe('Morpho IOracle interface', function () {
    it('Should return price', async function () {
      const {ppsOracle} = await loadFixture(initFixture)
      expect(await ppsOracle.price()).to.equal(PRICE)
    })
  })
})
