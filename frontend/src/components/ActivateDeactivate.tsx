import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { MouseEvent, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { injected } from '../utils/connectors';
import { useEagerConnect, useInactiveListener } from '../utils/hooks';
import { Provider } from '../utils/provider';

type ActivateFunction = (
  connector: AbstractConnector,
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => Promise<void>;

function getErrorMessage(error: Error): string {
  let errorMessage: string;

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
      break;
    case UnsupportedChainIdError:
      errorMessage = `You're connected to an unsupported network.`;
      break;
    case UserRejectedRequestError:
      errorMessage = `Please authorize this website to access your Ethereum account.`;
      break;
    default:
      errorMessage = error.message;
  }

  return errorMessage;
}

const StyledActivateDeactivateDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledActivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: green;
  cursor: pointer;
`;

const StyledDeactivateButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: red;
  cursor: pointer;
`;

function Activate(): ReactElement {
  const context = useWeb3React<Provider>();
  const { activate, active } = context;

  const [activating, setActivating] = useState<boolean>(false);

  function handleActivate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    async function _activate(activate: ActivateFunction): Promise<void> {
      setActivating(true);
      await activate(injected);
      setActivating(false);
    }

    _activate(activate);
  }

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has
  // granted access already
  const eagerConnectionSuccessful = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider,
  // if it exists
  useInactiveListener(!eagerConnectionSuccessful);

  return (
    <StyledActivateButton
      disabled={active}
      style={{
        cursor: active ? 'not-allowed' : 'pointer',
        borderColor: activating ? 'orange' : active ? 'unset' : 'green'
      }}
      onClick={handleActivate}
    >
      Connect
    </StyledActivateButton>
  );
}

function Deactivate(): ReactElement {
  const context = useWeb3React<Provider>();
  const { deactivate, active } = context;

  function handleDeactivate(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    deactivate();
  }

  return (
    <StyledDeactivateButton
      disabled={!active}
      style={{
        cursor: active ? 'pointer' : 'not-allowed',
        borderColor: active ? 'red' : 'unset'
      }}
      onClick={handleDeactivate}
    >
      Disconnect
    </StyledDeactivateButton>
  );
}

export function ActivateDeactivate(): ReactElement {
  const context = useWeb3React<Provider>();
  const { error } = context;

  if (!!error) {
    window.alert(getErrorMessage(error));
  }

  return (
    <StyledActivateDeactivateDiv>
      <Activate />
      <Deactivate />
    </StyledActivateDeactivateDiv>
  );
}
