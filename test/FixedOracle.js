const {loadFixture,} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {expect} = require('chai')

const PRICE = 42

describe('FixedOracle', function () {
  async function deployFixture() {
    const [deployer, owner] = await ethers.getSigners()
    const fixedOracle = await (await ethers.getContractFactory('FixedOracle')).deploy(owner.address)
    return {deployer, owner, fixedOracle}
  }

  async function initFixture() {
    const context = await loadFixture(deployFixture)
    const {owner, fixedOracle} = context
    await fixedOracle.connect(owner).setPrice(PRICE)
    return context
  }

  describe('Deployment', function () {
    it('Should set the price to 0, reverting on price', async function () {
      const {fixedOracle} = await loadFixture(deployFixture)
      await expect(fixedOracle.price()).revertedWithoutReason()
    })

    it('Should set the owner', async function () {
      const {owner, fixedOracle} = await loadFixture(deployFixture)
      expect(await fixedOracle.owner()).to.equal(owner.address)
    })
  })

  describe('Set price', function () {
    it('Should set a new price (owner)', async function () {
      const {owner, fixedOracle} = await loadFixture(initFixture)
      const price = 24
      await fixedOracle.connect(owner).setPrice(price)
      expect(await fixedOracle.price()).to.equal(price)
    })

    it(`Should don't set a new price (not owner)`, async function () {
      const {deployer, fixedOracle} = await loadFixture(initFixture)
      const price = 24
      const response = fixedOracle.connect(deployer).setPrice(price)
      await expect(response).revertedWithCustomError(fixedOracle, 'OwnableUnauthorizedAccount')
    })

    it('Should revert on price if 0', async function () {
      const {owner, fixedOracle} = await loadFixture(initFixture)
      await fixedOracle.connect(owner).setPrice(0)
      await expect(fixedOracle.price()).revertedWithoutReason()
    })
  })

  describe('Morpho IOracle interface', function () {
    it('Should return price', async function () {
      const {fixedOracle} = await loadFixture(initFixture)
      expect(await fixedOracle.price()).to.equal(PRICE)
    })
  })
})
