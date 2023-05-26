import {OwnedNft} from 'alchemy-sdk';
import {BigNumber, Contract, ethers} from 'ethers';

import {Stateful, StatefulResult, WrappedReaperState} from '../@types';
import {ReapersGambit, WrappedReaper} from '../abi';

export const getReapersGambitContract = ({
  reapersGambitContractAddress,
  provider,
}: {
  readonly reapersGambitContractAddress: string;
  readonly provider: ethers.providers.Web3Provider | undefined;
}): Contract => new Contract(reapersGambitContractAddress, ReapersGambit, provider?.getSigner?.());

export const getWrappedReaperContract = ({
  wrappedReaperContractAddress,
  provider,
}: {
  readonly wrappedReaperContractAddress: string;
  readonly provider: ethers.providers.Web3Provider | undefined;
}): Contract => new Contract(wrappedReaperContractAddress, WrappedReaper, provider?.getSigner?.());

export function isStatefulResult<T>(
  state: Stateful<T>
): state is StatefulResult<T> {
  return !(state.loading || ('error' in state) || !('result' in state));
}

export const maybeWrappedReaperResult = <
  FieldName extends keyof WrappedReaperState
>(state: Stateful<WrappedReaperState>, fieldName: FieldName): WrappedReaperState[FieldName] | null => {
  if (!isStatefulResult(state)) return null;

  return state.result[fieldName];
};

export const getStake = (ownedNft: OwnedNft | undefined) => {
  if (!ownedNft) return '';

  const attributes = ownedNft?.rawMetadata?.attributes || [];
  return String(attributes.find(e => e.trait_type === 'Staked')?.value);
};

export const stripDecimalComponent = (value: BigNumber, decimals: BigNumber) =>
  value.div(BigNumber.from('10').pow(decimals));

export const reinstateDecimalComponent = (value: BigNumber, decimals: BigNumber) =>
    value.mul(BigNumber.from('10').pow(decimals));
