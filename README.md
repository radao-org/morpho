# [Morpho](https://morpho.org/) for [Radao](https://radao.org/)

```shell
npm i

npx hardhat coverage
REPORT_GAS=true npx hardhat test

# deploy PPSOracle example
npx hardhat deployPPSOracle --network goerli --loan 0x795C388dBA8C8Eeda9163762C2A1aC2220ACB529 --collateral 0x4fc8dC4Da831D9dba10Ae64159d7E67a403CA6e4 --price 167.77
```

# Ethereum mainnet

```shell
# XPE/USDC
npx hardhat deployPPSOracle --network env --loan 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 --collateral 0x21728dD7bC8e643667331643dC5f7E300F351E72 --price 167.77
```
