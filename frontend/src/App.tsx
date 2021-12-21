import React, { ReactElement } from 'react';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { Provider } from './provider';

import { Greeter } from './components/Greeter';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';

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

const injectorName = 'Injected';

export function App(): ReactElement {
  const context = useWeb3React<Provider>();
  const { connector, library, account, activate, deactivate, active, error } =
    context;

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

  const injectorName = 'Injected';

  return (
    <>
      <Header />
      <hr style={{ margin: '2rem' }} />
      <div
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
                height: '3rem',
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
                  height: '3rem',
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

      <hr style={{ margin: '2rem' }} />

      <div
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'fit-content',
          maxWidth: '20rem',
          margin: 'auto'
        }}
      >
        {!!(library && account) && (
          <button
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature: any) => {
                  window.alert(`Success!\n\n${signature}`);
                })
                .catch((error: any) => {
                  window.alert(
                    'Failure!' +
                      (error && error.message ? `\n\n${error.message}` : '')
                  );
                });
            }}
          >
            Sign Message
          </button>
        )}
      </div>

      <hr style={{ margin: '2rem' }} />
      <Greeter></Greeter>
    </>
  );
}
