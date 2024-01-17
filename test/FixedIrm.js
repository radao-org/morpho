const {loadFixture,} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {expect} = require('chai')

const APR = '80000000000000000' // 8%
const RATE_PER_SEC = '2535047025'
const MARKET_PARAMS = [
  ethers.ZeroAddress,
  ethers.ZeroAddress,
  ethers.ZeroAddress,
  ethers.ZeroAddress,
  '0'
]
const MARKET = ['0', '0', '0', '0', '0', '0']

describe('FixedIrm', function () {
  async function deployFixture() {
    const fixedIrm = await (await ethers.getContractFactory('FixedIrm')).deploy(APR)
    return {fixedIrm}
  }

  describe('Deployment', function () {
    it('Should set the right apr', async function () {
      const {fixedIrm} = await loadFixture(deployFixture)
      expect(await fixedIrm.apr()).to.equal(APR)
    })

    it('Should set the right ratePerSec', async function () {
      const {fixedIrm} = await loadFixture(deployFixture)
      expect(await fixedIrm.ratePerSec()).to.equal(RATE_PER_SEC)
    })
  })

  describe('Morpho IIrm interface', function () {
    it('Without depending on the parameters, borrowRate should reply ratePerSec', async function () {
      const {fixedIrm} = await loadFixture(deployFixture)
      expect(await fixedIrm.borrowRate(MARKET_PARAMS, MARKET)).to.equal(RATE_PER_SEC)
    })

    it('Without depending on the parameters, borrowRateView should reply ratePerSec', async function () {
      const {fixedIrm} = await loadFixture(deployFixture)
      expect(await fixedIrm.borrowRateView(MARKET_PARAMS, MARKET)).to.equal(RATE_PER_SEC)
    })
  })
})
