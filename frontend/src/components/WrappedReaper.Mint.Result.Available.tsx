import * as React from 'react';

import {Button} from './Button';

export const WrappedReaperMintResultAvailable = React.memo(
  function WrappedReaperMintResultAvailable({
    onRequestMint,
  }: {
    readonly onRequestMint: () => void;
  }): JSX.Element {
    return (
      <div className="card mb-6" style={{padding: 0}}>
        <Button disabled={false} onClick={onRequestMint}>
          Mint
        </Button>
      </div>
    );
  }
);
