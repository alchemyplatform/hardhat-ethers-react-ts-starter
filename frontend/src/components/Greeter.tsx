import React, { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

import { ethers } from 'ethers';
import { formatEther } from '@ethersproject/units';
import { Contract } from '@ethersproject/contracts';

import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';

import { Provider } from '../ProviderLibrary';

const greeterContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function Greeter() {
  const context = useWeb3React<Provider>();
  const { library } = context;

  const [greeting, setGreeting] = React.useState<string>();
  const [greeterContract, setGreeterContract] = React.useState<Contract>();

  const signer = library?.getSigner(0);

  useEffect(
    function () {
      console.log(1);
      const Greeter = new ethers.ContractFactory(
        GreeterArtifact.abi,
        GreeterArtifact.bytecode,
        signer
      );

      async function getGreeting() {
        console.log(3);
        setGreeterContract(await Greeter.attach(greeterContractAddr));
        setGreeting(await greeterContract?.greet());
      }

      console.log(2);
      getGreeting();
    },
    [greeterContract, greeting, signer]
  );

  return (
    <>
      <h1>Greeting: {greeting}</h1>
    </>
  );
}
