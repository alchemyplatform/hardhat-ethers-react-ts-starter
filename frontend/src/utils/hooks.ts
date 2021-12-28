import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import { injected } from './connectors';
import { Provider } from './provider';

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React<Provider>();

  const [tried, setTried] = useState(false);

  // use useCallback() and useEffect() hooks together so that tryActivate() will only
  // be called once when attempting eager connection
  const tryActivate = useCallback((): void => {
    async function _tryActivate() {
      const isAuthorized = await injected.isAuthorized();

      if (isAuthorized) {
        try {
          await activate(injected, undefined, true);
        } catch (error: any) {
          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
      }

      setTried(true);
    }

    _tryActivate();
  }, [activate]);

  useEffect((): void => {
    tryActivate();
  }, [tryActivate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect((): void => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false): void {
  const { active, error, activate } = useWeb3React<Provider>();

  useEffect((): (() => void) | undefined => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = (): void => {
        console.log("Handling 'connect' event");
        activate(injected);
      };

      const handleChainChanged = (chainId: string | number): void => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string[]): void => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      // cleanup function
      return (): void => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
