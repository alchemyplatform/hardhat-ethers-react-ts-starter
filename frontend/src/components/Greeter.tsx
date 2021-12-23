import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';

import { useWeb3React } from '@web3-react/core';

import { ethers, Contract, Signer } from 'ethers';

import styled from 'styled-components';

import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';

import { Provider } from '../utils/provider';

const greeterContractAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 135px 1.3fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const CurrentGreeting = styled.input.attrs(() => ({ type: 'text' }))`
  color: blue;
  font-weight: bold;
  font-size: 1.2rem;
  border-style: none;
`;

const StyledTextInput = styled.input.attrs(() => ({ type: 'text' }))`
  width: auto;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

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
    async function getGreeterContract(): Promise<void> {
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

  function handleGreetingChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleGreetingSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!greeterContract) {
      window.alert('Undefined greeterContract');
      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(greeterContract: Contract): Promise<void> {
      let setGreetingTxn;

      try {
        setGreetingTxn = await greeterContract.setGreeting(greetingInput);
      } catch (error: any) {
        window.alert(
          'Failure!' + (error && error.message ? `\n\n${error.message}` : '')
        );

        return;
      }

      await setGreetingTxn.wait();
      const updatedGreeting = await greeterContract.greet();

      if (updatedGreeting !== greeting) {
        setGreeting(updatedGreeting);
      }
    }

    submitGreeting(greeterContract);
  }

  return (
    <StyledGreetingDiv>
      <StyledLabel htmlFor="greeting">Current greeting</StyledLabel>
      <CurrentGreeting
        id="greeting"
        type="text"
        readOnly={true}
        value={greeting}
      />
      {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
      <div></div>
      <StyledLabel htmlFor="greetingInput">Set new greeting</StyledLabel>
      <StyledTextInput
        id="greetingInput"
        type="text"
        onChange={handleGreetingChange}
      />
      <StyledButton onClick={handleGreetingSubmit}>Submit</StyledButton>
    </StyledGreetingDiv>
  );
}
