# Starter React Typescript Ethers.js Hardhat Project

This project is a companion project to [ChainShot](https://www.chainshot.com)'s [How to Build a React Dapp with Hardhat and MetaMask](https://medium.com/p/9cec8f6410d3) Medium article. The project is a starter frontend Dapp that interacts with a `Greeter.sol` smart contract runnning on a local Hardhat node. The smart contract and Hardhat node part of the project were created by installing the Hardhat npm package and bootstrapping a Hardhat project by running: `yarn hardhat init`. For more details you can read more in the [Hardhat README doc](https://github.com/nomiclabs/hardhat).

The Medium article and this GitHub repo are recommended for anyone wanting to build up their web3 skills and are helpful resources for anyone interested in joining any of [ChainShot's bootcamps](https://www.chainshot.com/bootcamp).

The simple `Greeter.sol` contract allows reading a greeting from the blockchain and setting a new greeting by writing to the blockchain via a transaction. The `Greeter.sol` smart contract aso comes with tests to test the contract. Additonally, this project makes use of Hardhat tasks, uses Typescript, and has uses other standard developer tooling such as eslint and prettier to help ensure code correctness and standarized code formatting.

Pull this project down from GitHub, cd into the project directory and run the following commands to get setup and running.

```shell
yarn
yarn compile
yarn hardhat node
```

The commands above will install the project dependencies, compile the sample contract and run a local Hardhat node on port `8545`, using chain id `31337`.

After running the above tasks checkout the frontend [README.md](https://github.com/ChainShot/hardhat-ethers-react-ts-starter/tree/main/frontend/README.md) to run a React Dapp using ethers.js that will interact with the sample contract on the local Hardhat node.

Some other hardhat tasks to try out are:

```shell
yarn hardhat accounts
yarn hardhat clean
yarn hardhat compile
yarn hardhat deploy
yarn hardhat help
yarn hardhat node
yarn hardhat test
```
