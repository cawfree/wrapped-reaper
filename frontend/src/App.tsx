import {useWeb3React} from '@web3-react/core';
import * as React from 'react';
import {Nft, OwnedNft} from 'alchemy-sdk';
import {BigNumber} from 'ethers';

import {
  ModalBurn,
  ModalInfo,
  ModalMint,
  ModalWrappedReaper,
  WrappedReaperMint,
  WrappedReaperNft,
  WrappedReaperScythe,
} from './components';
import {useWrappedReaper, useWrappedReaperDeploymentSettings} from './hooks';
import {isStatefulResult} from './utils';
import {MintState} from './@types';

function App() {
  const {chainId, openSeaCollectionItemUri} = useWrappedReaperDeploymentSettings();
  const {isActive, account, connector} = useWeb3React();

  const wrappedReaperResult = useWrappedReaper();

  const {refreshState, burn, mint} = wrappedReaperResult;

  const [infoModalActive, setInfoModalActive] = React.useState(false);
  const [wrappedReaperModalActive, setWrappedReaperModalActive] = React.useState(false);
  const [mintModalActive, setMintModalActive] = React.useState(false);
  const [nftToBurn, setNftToBurn] = React.useState<OwnedNft | undefined>();
  const [mintState, setMintState] = React.useState<MintState | undefined>();

  React.useEffect(() => void (async () => {
    try {
      if (connector && connector.connectEagerly) await connector.connectEagerly();

      if (!isActive) await connector.activate(chainId);

    } catch (cause) {
      console.error('Failed to initialize connector.', {cause});
    }
  })(), [chainId]);

  const onConnectClick = React.useCallback(
    async () => {
      if (!isActive) await connector.activate(chainId);
    },
    [isActive, connector, chainId]
  );

  const onRequestBurn = React.useCallback(
    async (toAddress: string) => {
      if (!nftToBurn) throw new Error('There is no token to burn!');

      const {tokenId} = nftToBurn;

      await burn(tokenId, toAddress);

      await refreshState();
    },
    [nftToBurn, refreshState, burn]
  );

  const onRequestMint = React.useCallback(
    async (stake: BigNumber) => {
      try {
        await mint(stake, setMintState);

        await refreshState();
      } catch(e) {
        console.error(e);
      } finally {
        setMintState(undefined)
      }
    },
    [refreshState, mint]
  );

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-mono">
      <div className="md:absolute md:top-6 md:right-6 flex flex-col md:flex-row items-center p-4 md:p-0">
        <a href="https://app.uniswap.org/#/swap?outputCurrency=0x2C91D908E9fab2dD2441532a04182d791e590f2d" target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6">Trade</a>
        <button className="w-full btn md:mr-6 mt-2 md:mt-0" onClick={() => { setInfoModalActive(true) }}>Info</button>
        <a href="https://bb.reapersgambit.com" target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6 mt-2 md:mt-0">Leaderboard</a>
        <a href="https://flipsidecrypto.xyz/scopecreep/reapers-gambit-2EytiP" target="_blank" rel="noreferrer noopener" className="w-full text-center btn md:mr-6 mt-2 md:mt-0">Stats</a>
        <button className="btn w-full mt-2 md:mt-0" onClick={onConnectClick}>
          {isActive ? account?.substring(0, 5) + ".." + account?.substring(account.length - 3) : "Connect Wallet"}
        </button>
      </div>
      <div className="w-full mt-12">
        <div className="w-full md:w-3/4 mx-auto py-12 px-4 md:px-0">
          <div className="mb-6 flex items-center">
            <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block px-2 py-1">Wrapped Reaper</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 ml-4 cursor-pointer"
              onClick={() => setWrappedReaperModalActive(true)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <WrappedReaperMint
            onRequestMint={() => setMintModalActive(true)}
            wrappedReaperResult={wrappedReaperResult}
          />
          <WrappedReaperScythe wrappedReaperResult={wrappedReaperResult} />
          <div className="mt-16 mt-6">
            <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-6 px-2 py-1">
              {isStatefulResult(wrappedReaperResult) ? 'Wallet' : 'Loading Wallet...'}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {isStatefulResult(wrappedReaperResult) && (
                <>
                  {wrappedReaperResult.result.ownedNfts.map((ownedNft: OwnedNft) => (
                    <WrappedReaperNft
                      children="Burn"
                      nft={ownedNft}
                      key={String(ownedNft.tokenId)}
                      onClick={() => setNftToBurn(ownedNft)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 inset-x-0 flex justify-center py-6">
        <a href="https://twitter.com/reapers_gambit" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentcolor" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
        </a>
        <a href="https://t.me/+Co0f1yYovp44NTU1" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
        </a>
        <a href="https://etherscan.io/token/0x2c91d908e9fab2dd2441532a04182d791e590f2d" target="_blank" rel="noreferrer noopener" className="block mx-3">
          <svg role="img" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>
        </a>
      </footer>
      <ModalInfo isActive={infoModalActive} setIsActive={setInfoModalActive} />
      <ModalWrappedReaper isActive={wrappedReaperModalActive} setIsActive={setWrappedReaperModalActive} />
      <ModalBurn
        nftToBurn={nftToBurn}
        onChangeNftToBurn={setNftToBurn}
        onRequestBurn={onRequestBurn}
      />
      {isStatefulResult(wrappedReaperResult) && (
        <ModalMint
          mintState={mintState}
          isActive={mintModalActive}
          onRequestMint={onRequestMint}
          setIsActive={setMintModalActive}
          wrappedReaperState={wrappedReaperResult.result}
        />
      )}
      <div className="p-3" />
    </div>
  );
}

export default App;
