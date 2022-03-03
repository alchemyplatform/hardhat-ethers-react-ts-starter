import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

export function SignMessage() {
  const context = useWeb3React();
  const { account, active, library } = context;

  function handleSignMessage(event) {
    event.preventDefault();

    if (!library || !account) {
      window.alert('Wallet not connected');
      return;
    }

    async function signMessage(library, account) {
      try {
        const signature = await library.getSigner(account).signMessage('👋');
        window.alert(`Success!\n\n${signature}`);
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    signMessage(library, account);
  }

  return (
    <StyledButton
      disabled={!active ? true : false}
      style={{
        cursor: !active ? 'not-allowed' : 'pointer',
        borderColor: !active ? 'unset' : 'blue'
      }}
      onClick={handleSignMessage}
    >
      Sign Message
    </StyledButton>
  );
}
