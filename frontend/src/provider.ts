import { Web3Provider } from '@ethersproject/providers';
import type { Web3Provider as ProviderType } from '@ethersproject/providers';

export function getProvider(_provider: any): ProviderType {
  const provider = new Web3Provider(_provider);
  provider.pollingInterval = 12000;
  return provider;
}

export type Provider = ProviderType;
