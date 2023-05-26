import * as React from 'react';

import {Stateful, WrappedReaperState} from '../@types';
import {isStatefulResult} from '../utils';

import {WrappedReaperMintResult} from './WrappedReaper.Mint.Result';

export const WrappedReaperMint = React.memo(
  function WrappedReaperMint({
    onRequestMint,
    wrappedReaperResult,
  }: {
    readonly onRequestMint: () => void;
    readonly wrappedReaperResult: Stateful<WrappedReaperState>;
  }): JSX.Element {

    if (isStatefulResult(wrappedReaperResult))
      return (
        <WrappedReaperMintResult
          onRequestMint={onRequestMint}
          wrappedReaperState={wrappedReaperResult.result}
        />
      );

    return (
      <div className="card mb-6">
        <div className="font-mono uppercase text-center text-xl">Loading...</div>
      </div>
    );
  }
);
