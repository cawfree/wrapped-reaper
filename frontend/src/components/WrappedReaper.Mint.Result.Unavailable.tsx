import * as React from 'react';

import {WrappedReaperState} from '../@types';
import {useWrappedReaperDeploymentSettings} from '../hooks';

export const WrappedReaperMintResultUnavailable = React.memo(
  function WrappedReaperMintResultUnavailable({
    wrappedReaperState,
  }: {
    readonly wrappedReaperState: WrappedReaperState;
  }): JSX.Element {
    const {openSeaCollectionUri} = useWrappedReaperDeploymentSettings();
    const {maxSupply} = wrappedReaperState;

    return (
      <div className="card mb-6">
        <div className="font-mono uppercase text-center text-xl font-bold">
          This realm is too weak
        </div>
        <div className="font-mono text-center text-l px-6 pt-2">
          Sorry, the current realm may only sustain a maximum of <b>{String(maxSupply)}</b> tokens at any one time.
        </div>
        <div className="font-mono text-center text-l px-6 pt-2">
          To mint Wrapped Reaper, <u><b><a href={openSeaCollectionUri}>an existing token must be sacrificed</a></b></u>.
        </div>
      </div>
    );
  }
);
