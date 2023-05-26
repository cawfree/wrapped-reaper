import {OwnedNft, Nft} from 'alchemy-sdk';
import {BigNumber} from 'ethers';

export type StatefulResult<T> = {loading: false, result: T};

export type Stateful<T> = Readonly<
  | {loading: true} | StatefulResult<T> | {loading: false, error: Error}
>;

export type WrappedReaperState = {
  readonly totalSupply: BigNumber;
  readonly maxSupply: BigNumber;
  readonly minStake: BigNumber;
  readonly maxStake: BigNumber;
  readonly decimals: BigNumber;
  readonly reapersGambitBalance: BigNumber;
  readonly bladeWidth: BigNumber;
  readonly maxTaxBasisPoints: BigNumber;
  readonly minTaxBasisPoints: BigNumber;
  readonly bladeDiscountBasisPoints: BigNumber;
  readonly totalBurned: BigNumber;
  readonly totalWrapped: BigNumber;
  readonly ownedNfts: readonly OwnedNft[];
  readonly allNfts: readonly Nft[];
};

export enum MintState {
  READYING = 'READYING',
  REQUEST_ALLOWANCE = 'REQUEST_ALLOWANCE',
  MINTING = 'MINTING'
}
