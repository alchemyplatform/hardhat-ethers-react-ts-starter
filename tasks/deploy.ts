import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import '@nomiclabs/hardhat-waffle';

task('deploy', 'Deploy Greeter contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    const Greeter = await hre.ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, Hardhat!');

    await greeter.deployed();

    console.log('Greeter deployed to:', greeter.address);
  }
);
