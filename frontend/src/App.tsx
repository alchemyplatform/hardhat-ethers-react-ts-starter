import React, { ReactElement } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';

import styled from 'styled-components';

import { Provider } from './provider';

import { Greeter } from './components/Greeter';
import { Header } from './components/Header';
import { SectionDivider } from './components/SectionDivider';
import { Spinner } from './components/Spinner';
import { SignMessage } from './components/SignMessage';

import { injected } from './connectors';
import { useEagerConnect, useInactiveListener } from './hooks';

function getErrorMessage(error: Error): string {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network.";
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.';
  } else {
    console.error(error);
    return 'An unknown error occurred. Check the console for more details.';
  }
}

const StyledApp = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  const context = useWeb3React<Provider>();
  const { connector, activate, deactivate, active, error } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  React.useEffect((): void => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const eagerConnectionSuccessful = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!eagerConnectionSuccessful || !!activatingConnector);

  return (
    <StyledApp>
      <Header />
      <SectionDivider />
      {/* <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {(() => {
          const activating = injected === activatingConnector;
          const connected = injected === connector;
          const disabled =
            !eagerConnectionSuccessful ||
            !!activatingConnector ||
            connected ||
            !!error;

          return (
            <button
              style={{
                height: '2rem',
                borderRadius: '1rem',
                borderColor: activating
                  ? 'orange'
                  : connected
                  ? 'green'
                  : 'unset',
                cursor: disabled ? 'unset' : 'pointer',
                position: 'relative'
              }}
              disabled={disabled}
              key={injectorName}
              onClick={() => {
                setActivatingConnector(injected);
                activate(injected);
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'black',
                  margin: '0 0 0 1rem'
                }}
              >
                {activating && (
                  <Spinner
                    color={'black'}
                    style={{ height: '25%', marginLeft: '-1rem' }}
                  />
                )}
                {connected && (
                  <span role="img" aria-label="check">
                    ✅
                  </span>
                )}
              </div>
              {injectorName}
            </button>
          );
        })()}
        {(() => {
          return (
            (active || error) && (
              <button
                style={{
                  height: '2rem',
                  marginTop: '2rem',
                  borderRadius: '1rem',
                  borderColor: 'red',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  deactivate();
                }}
              >
                Deactivate
              </button>
            )
          );
        })()}
        {(() => {
          return (
            !!error && (
              <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
                {getErrorMessage(error)}
              </h4>
            )
          );
        })()}
      </div>
      <HorizontalRule />*/}
      <SignMessage />
      <SectionDivider />
      <Greeter />
    </StyledApp>
  );
}
