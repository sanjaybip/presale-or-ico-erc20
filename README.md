# Presale Or ICO Smart Contract Example

This is smart contract written in `solidity` that let anyone create presale or ICO (Initial Coin Offering) for an ERC20 token. Owner can set rate that he is offering per ether or BNB. They can can also set the fund recevier wallet, the wallet that will receive the ether or BNB in exchange of the ERC20 token.

Deployer of the contract need to pass the contract address of the ERC20 token.

---

## Run these commands

### To install all the dependencies

```shell
yarn install
```
### Compile code
```shell
yarn hardhat compile
```
### Running Tests
```shell
yarn hardhat test
```
### Running localhost hardhat blockchain network
```shell
yarn hardhat node
```
### Deploying
```shell
yarn hardhat run ./scripts/deploy.js
```

