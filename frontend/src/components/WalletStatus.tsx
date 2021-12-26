import { ReactElement, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { ethers } from 'ethers';

import styled from 'styled-components';

import { Provider } from '../utils/provider';

const StyledWalletStatusDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: .6fr .1fr .7fr 1fr .1fr .7fr .5fr .1fr 1.3fr .4fr .1fr 1.3fr .1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

function ChainId(): ReactElement {
  const { chainId } = useWeb3React<Provider>();

  return (
    <>
      <span><strong>Chain Id</strong></span>
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
      <span><strong>Block Number</strong></span>
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
      <span><strong>Account</strong></span>
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

  const [balance, setBalance] = useState<ethers.BigNumber>();
  
  useEffect((): (() => void) | undefined => {
    if (!account || !library) {
      return;
    }

    let stale = false;

    library
      .getBalance(account)
      .then((balance: ethers.BigNumber) => {
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
      <span><strong>Balance</strong></span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>
        {balance === null
          ? 'Error'
          : balance
          ? `Ξ${Math.round(+ethers.utils.formatEther(balance) * 1e4) / 1e4}`
          : ''}
      </span>
    </>
  );
}

function StatusIcon(): ReactElement {
  const { active, error } = useWeb3React<Provider>();

  return (
    <h1>{active ? '🟢' : error ? '🔴' : '🟠'}</h1>
  );
}

export function WalletStatus(): ReactElement {
  return (
    <StyledWalletStatusDiv>
        <ChainId />
        <BlockNumber />
        <Account />
        <Balance />
        <StatusIcon />
    </StyledWalletStatusDiv>
  );
}
