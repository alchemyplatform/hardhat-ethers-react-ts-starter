
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { useState } from 'react';
import styled from 'styled-components';
import { injected } from '../utils/connectors';
import { useEagerConnect, useInactiveListener } from '../utils/hooks';


function getErrorMessage(error) {
  let errorMessage;

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

function Activate() {
  const context = useWeb3React();
  const { activate, active } = context;

  const [activating, setActivating] = useState(false);

  function handleActivate(event) {
    event.preventDefault();

    async function _activate(activate) {
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

function Deactivate() {
  const context = useWeb3React();
  const { deactivate, active } = context;

  function handleDeactivate(event) {
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

export function ActivateDeactivate() {
  const context = useWeb3React();
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
