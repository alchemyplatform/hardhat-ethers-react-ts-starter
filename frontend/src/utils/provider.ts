import type { Web3Provider as ProviderType } from '@ethersproject/providers';
import { Web3Provider } from '@ethersproject/providers';

export function getProvider(provider: any): ProviderType {
  const web3Provider = new Web3Provider(provider);
  web3Provider.pollingInterval = 1000;
  return web3Provider;
}

export type Provider = ProviderType;
