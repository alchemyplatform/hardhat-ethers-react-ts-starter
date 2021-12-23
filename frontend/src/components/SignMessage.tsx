import { MouseEvent, ReactElement } from 'react';

import { useWeb3React } from '@web3-react/core';

import styled from 'styled-components';

import { Provider } from '../utils/provider';

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

export function SignMessage(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, account } = context;

  function handleSignMessage(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!library || !account) {
      window.alert('Wallet not connected');
      return;
    }

    async function signMessage(
      library: Provider,
      account: string
    ): Promise<void> {
      try {
        const signature = await library.getSigner(account).signMessage('👋');
        window.alert(`Success!\n\n${signature}`);
      } catch (error: any) {
        window.alert(
          'Failure!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    signMessage(library, account);
  }

  return <StyledButton onClick={handleSignMessage}>Sign Message</StyledButton>;
}
