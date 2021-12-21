import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';

import { useWeb3React } from '@web3-react/core';

import { ethers, Contract, Signer } from 'ethers';

import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';

import { Provider } from '../provider';

const greeterContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function Greeter(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library } = context;

  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [greeting, setGreeting] = useState<string>('');
  const [greetingInput, setGreetingInput] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    async function getGreeterContract() {
      const Greeter = new ethers.ContractFactory(
        GreeterArtifact.abi,
        GreeterArtifact.bytecode,
        signer
      );

      setGreeterContract(Greeter.attach(greeterContractAddr));
    }

    getGreeterContract();
  }, [signer]);

  useEffect((): void => {
    if (!greeterContract) {
      return;
    }

    async function getGreeting(greeterContract: Contract): Promise<void> {
      const _greeting = await greeterContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greeterContract);
  }, [greeterContract, greeting]);

  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!greeterContract) {
      throw new Error('Undefined greeterContract');
    }

    if (!greeting) {
      throw new Error('Greeting cannot be empty');
    }

    async function submitGreeting(greeterContract: Contract) {
      const setGreetingTxn = await greeterContract.setGreeting(greetingInput);
      await setGreetingTxn.wait();
      const updatedGreeting = await greeterContract.greet();

      if (updatedGreeting !== greeting) {
        setGreeting(updatedGreeting);
      }
    }

    submitGreeting(greeterContract);
  }

  return (
    <>
      <div>Greeting: {greeting}</div>
      <div>
        Set new greeting:
        <input type="text" onChange={handleGreetingChange}></input>
        <button onClick={handleGreetingSubmit}>Submit</button>
      </div>
    </>
  );
}
