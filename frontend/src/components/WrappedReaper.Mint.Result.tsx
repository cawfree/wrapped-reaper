import * as React from 'react';

import {WrappedReaperState} from '../@types';

import {WrappedReaperMintResultAvailable} from './WrappedReaper.Mint.Result.Available';
import {WrappedReaperMintResultUnavailable} from './WrappedReaper.Mint.Result.Unavailable';

export const WrappedReaperMintResult = React.memo(
  function WrappedReaperMintResult({
    onRequestMint,
    wrappedReaperState,
  }: {
    readonly onRequestMint: () => void;
    readonly wrappedReaperState: WrappedReaperState;
  }): JSX.Element {

   const {totalSupply, maxSupply} = wrappedReaperState;

   const isMintingUnavailable = totalSupply.gte(maxSupply);

   const Component = isMintingUnavailable ? WrappedReaperMintResultUnavailable : WrappedReaperMintResultAvailable;

   return <Component wrappedReaperState={wrappedReaperState} onRequestMint={onRequestMint} />;
  }
);
