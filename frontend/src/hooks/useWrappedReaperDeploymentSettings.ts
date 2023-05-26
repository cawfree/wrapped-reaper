import * as React from 'react';
import {Network} from 'alchemy-sdk';

const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
const isMainnet = process.env.REACT_APP_IS_MAINNET === String(true);

export function useWrappedReaperDeploymentSettings() {
  return React.useMemo(
    () => {
      if (isMainnet) {
        return {
          chainId: 1,
          network: Network.ETH_MAINNET,
          alchemyApiKey,
          reapersGambitContractAddress: '0x2C91D908E9fab2dD2441532a04182d791e590f2d',
          reapersGambitEtherscanLink: `https://etherscan.io/address/0x2C91D908E9fab2dD2441532a04182d791e590f2d`,
          wrappedReaperContractAddress: '0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC',
          wrappedReaperEtherscanLink: `https://etherscan.io/address/0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC`,
          openSeaCollectionItemUri: `https://opensea.io/assets/ethereum/0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC`,
          openSeaCollectionUri: 'https://opensea.io/collection/wrapped-reaper/',
          forceUpdateUri: (tokenId: string) =>
            `https://api.opensea.io/api/v1/asset/0xeC91E38a6Bd8D25c582d86bECdAd2003A25deECC/${tokenId}/?force_update=true`,
        };
      }
      return {
        chainId: 5,
        network: Network.ETH_GOERLI,
        alchemyApiKey,
        reapersGambitContractAddress: '0x8c741b6543ffd188e8862C8795321e3413b2E625',
        reapersGambitEtherscanLink: `https://goerli.etherscan.io/address/0x8c741b6543ffd188e8862C8795321e3413b2E625`,
        wrappedReaperContractAddress: '0xFFc20718033fFb9419931A7FaB8884DB527340e6',
        wrappedReaperEtherscanLink: `https://goerli.etherscan.io/address/0xFFc20718033fFb9419931A7FaB8884DB527340e6`,
        openSeaCollectionItemUri: `https://testnets.opensea.io/assets/goerli/0xFFc20718033fFb9419931A7FaB8884DB527340e6`,
        openSeaCollectionUri: 'https://testnets.opensea.io/collection/wrapped-reaper-5/',
        forceUpdateUri: (tokenId: string) =>
          `https://testnets-api.opensea.io/api/v1/asset/0xFFc20718033fFb9419931A7FaB8884DB527340e6/${tokenId}/?force_update=true`,
      };
    },
    []
  );
}
