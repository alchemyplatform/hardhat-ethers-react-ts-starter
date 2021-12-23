import { ReactElement, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { ethers } from 'ethers';

import styled from 'styled-components';

import { Provider } from '../provider';

function ChainId(): ReactElement {
  const { chainId } = useWeb3React<Provider>();

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ''}</span>
    </>
  );
}

function BlockNumber(): ReactElement {
  const { chainId, library } = useWeb3React<Provider>();

  const [blockNumber, setBlockNumber] = useState<number>();

  useEffect((): (() => void) | undefined => {
    if (!library) {
      return;
    }

    let stale = false;

    async function getBlockNumber(library: Provider): Promise<void> {
      try {
        const blockNumber = await library.getBlockNumber();

        if (!stale) {
          setBlockNumber(blockNumber);
        }
      } catch (_: any) {
        if (!stale) {
          setBlockNumber(undefined);
        }
      }

      library.on('block', setBlockNumber);
    }

    getBlockNumber(library);

    // cleanup function
    return (): void => {
      stale = true;
      library.removeListener('block', setBlockNumber);
      setBlockNumber(undefined);
    };
  }, [library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Block Number</span>
      <span role="img" aria-label="numbers">
        🔢
      </span>
      <span>{blockNumber === null ? 'Error' : blockNumber ?? ''}</span>
    </>
  );
}

function Account(): ReactElement {
  const { account } = useWeb3React<Provider>();

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(
              account.length - 4
            )}`
          : ''}
      </span>
    </>
  );
}

function Balance(): ReactElement {
  const { account, library, chainId } = useWeb3React<Provider>();

  const [balance, setBalance] = useState();
  useEffect((): (() => void) | undefined => {
    if (!account || !library) {
      return;
    }

    let stale = false;

    library
      .getBalance(account)
      .then((balance: any) => {
        if (!stale) {
          setBalance(balance);
        }
      })
      .catch(() => {
        if (!stale) {
          setBalance(undefined);
        }
      });

    // cleanup function
    return (): void => {
      stale = true;
      setBalance(undefined);
    };
  }, [account, library, chainId]); // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null
          ? 'Error'
          : balance
          ? `Ξ${ethers.utils.formatEther(balance)}`
          : ''}
      </span>
    </>
  );
}

const StyledHeader = styled.div``;

export function Header(): ReactElement {
  const { active, error } = useWeb3React<Provider>();

  return (
    <StyledHeader>
      <h1 style={{ margin: '1rem', textAlign: 'right' }}>
        {active ? '🟢' : error ? '🔴' : '🟠'}
      </h1>
      {/* <h3
        style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: '1fr min-content 1fr',
          maxWidth: '20rem',
          lineHeight: '2rem',
          margin: 'auto'
        }}
      >
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
      </h3> */}
    </StyledHeader>
  );
}
