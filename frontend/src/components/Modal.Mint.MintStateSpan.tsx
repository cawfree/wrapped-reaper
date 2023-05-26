import * as React from 'react';

import {MintState} from '../@types';

import {Ellipses} from './Ellipses';

export const ModalMintMintStateSpan = React.memo(
  function ModalMintMintStateSpan({
    mintState: maybeMintState,
  }: {
    readonly mintState: MintState | undefined;
  }): JSX.Element {

    const children = maybeMintState === MintState.REQUEST_ALLOWANCE
      ? 'Approving'
      : maybeMintState === MintState.MINTING
      ? 'Minting'
      : 'Preparing';

    return <Ellipses key={children} children={children} />;
  }
);
