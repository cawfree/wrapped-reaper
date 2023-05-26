import * as React from 'react';
import {Nft} from 'alchemy-sdk';

import {useWrappedReaperDeploymentSettings} from '../hooks';

export const WrappedReaperNft = React.memo(
  function WrappedReaperNft({
    children,
    nft,
    onClick,
  }: React.PropsWithChildren<{
    readonly nft: Nft;
    readonly onClick: () => void;
  }>): JSX.Element {
    const {openSeaCollectionItemUri} = useWrappedReaperDeploymentSettings();

    const href = `${openSeaCollectionItemUri}/${nft.tokenId}`;

    return (
      <div className="card" style={{paddingBottom: 0}}>
        <a href={href} target="_blank" rel="noreferrer noopener">
          <div className="font-mono uppercase text-center text-xl lg:text-base xl:text-xl pb-6">
            {nft.title}
          </div>
        </a>
        <div className="w-full">
          <a href={href} target="_blank" rel="noreferrer noopener">
            <img alt={nft.title} src={nft.media?.[0]?.raw} />
          </a>
        </div>
        <div className="w-full grid grid-cols-1">
          <button
            children={children}
            onClick={onClick}
            className="font-bold text-3xl uppercase bg-black text-white inline-block w-full text-center p-2"
          />
        </div>
      </div>
    );
  }
);
