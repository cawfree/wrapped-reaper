import * as React from 'react';
import {useWeb3React} from '@web3-react/core';
import {BigNumber, ethers} from 'ethers';
import {Alchemy} from 'alchemy-sdk';

import {MintState, Stateful, WrappedReaperState} from '../@types';
import {getReapersGambitContract, getWrappedReaperContract,} from '../utils';

import {useWrappedReaperDeploymentSettings} from './useWrappedReaperDeploymentSettings';

const loading = (): Stateful<WrappedReaperState> => ({loading: true});

const inactive = (): Stateful<WrappedReaperState> =>
  ({loading: false, error: new Error('Account not yet active.')});

const ALLOWANCE_APPROVE_ALL = BigNumber.from('2').pow('256').sub('1');

type MintStateChangedCallback = (nextMintState: MintState) => void;

export function useWrappedReaper(): Stateful<WrappedReaperState> & {
  readonly refreshState: () => Promise<void>;
  readonly mint: (stake: BigNumber, onMintStateChanged: MintStateChangedCallback) => Promise<void>;
  readonly burn: (tokenId: string, toAddress: string) => Promise<void>;
} {
  const {
    alchemyApiKey,
    network,
    reapersGambitContractAddress,
    wrappedReaperContractAddress,
  } = useWrappedReaperDeploymentSettings();
  const { isActive, account, provider } = useWeb3React();

  const [state, setState] = React.useState<Stateful<WrappedReaperState>>(!isActive ? inactive: loading);

  const refreshState = React.useCallback(
    async () => {
      if (!isActive || !account) return setState(inactive);

      setState(loading);

      const alchemy = new Alchemy({apiKey: alchemyApiKey, network});

      try {
        const reapersGambitContract = getReapersGambitContract({
          reapersGambitContractAddress,
          provider,
        });
        const wrappedReaperContract = getWrappedReaperContract({
          wrappedReaperContractAddress,
          provider,
        });
        const [
          {ownedNfts},
          {nfts: allNfts},
          totalSupply,
          maxSupply,
          minStake,
          maxStake,
          decimals,
          reapersGambitBalance,
          bladeWidth,
          maxTaxBasisPoints,
          minTaxBasisPoints,
          bladeDiscountBasisPoints,
          totalBurned,
          totalWrapped,
        ] = await Promise.all([
          alchemy.nft.getNftsForOwner(
            account,
            {contractAddresses: [wrappedReaperContractAddress]},
          ),
          // TODO: This isn't all, just the first page. If we're only allowing 100 then that's fine.
          alchemy.nft.getNftsForContract(wrappedReaperContractAddress),
          wrappedReaperContract.totalSupply(),
          wrappedReaperContract.maxSupply(),
          wrappedReaperContract.minStake(),
          wrappedReaperContract.maxStake(),
          wrappedReaperContract.decimals(),
          reapersGambitContract.balanceOf(account),
          wrappedReaperContract.bladeWidth(),
          wrappedReaperContract.maxTaxBasisPoints(),
          wrappedReaperContract.minTaxBasisPoints(),
          wrappedReaperContract.bladeDiscountBasisPoints(),
          reapersGambitContract.balanceOf(ethers.utils.getAddress('0x000000000000000000000000000000000000dEaD')),
          reapersGambitContract.balanceOf(wrappedReaperContractAddress),
        ]);

        setState({
          loading: false,
          result: {
            allNfts,
            ownedNfts,
            totalSupply,
            maxSupply,
            minStake,
            maxStake,
            decimals,
            reapersGambitBalance,
            bladeWidth,
            maxTaxBasisPoints,
            minTaxBasisPoints,
            bladeDiscountBasisPoints,
            totalBurned,
            totalWrapped,
          },
        });

      } catch (cause) {
        setState({loading: false, error: new Error('Failed to update.', {cause})});
      }
    }, [
    isActive,
    account,
    reapersGambitContractAddress,
    wrappedReaperContractAddress,
    provider,
    alchemyApiKey,
    network,
  ]);

  const burn = React.useCallback(
    async (tokenId: string, toAddress: string): Promise<void> => {
      const wrappedReaperContract = getWrappedReaperContract({
        wrappedReaperContractAddress,
        provider,
      });

      await (await wrappedReaperContract.burn(tokenId, ethers.utils.getAddress(toAddress))).wait();
    },
    [wrappedReaperContractAddress, provider]
  );

  const mint = React.useCallback(
    async (stake: BigNumber, onMintStateChanged: MintStateChangedCallback) => {

      onMintStateChanged(MintState.READYING);

      const reapersGambit = getReapersGambitContract({
        reapersGambitContractAddress,
        provider,
      });

      const wrappedReaper = getWrappedReaperContract({
        wrappedReaperContractAddress,
        provider,
      });

      // Determine the currentAllowance of the caller to see if we need to increase it.
      const currentAllowance: BigNumber = await reapersGambit.allowance(account, wrappedReaperContractAddress);

      const [totalSupply] = await Promise.all([
        wrappedReaper.totalSupply(),
      ]);

      const totalCost: BigNumber = await wrappedReaper.scythe(totalSupply, stake);

      const basisPoints = 600 /* 6% */;
      const maxSlippage = BigNumber.from(totalCost).div(10000).mul(basisPoints);
      const maxPrice = totalCost.add(maxSlippage);

      // TODO: If we're sceptical about this, we could just use increaseAllowance instead to ensure that we
      //       increase the currentAllowance by (maximumPrice - currentAllowance) to ensure the mint succeeds.
      // Check if the account hasn't permitted an unlimited spend from the contract.
      if (!currentAllowance.gte(maxPrice)) {
        onMintStateChanged(MintState.REQUEST_ALLOWANCE);
        // If not, let's enable it.
        await (await reapersGambit.approve(wrappedReaperContractAddress, ALLOWANCE_APPROVE_ALL)).wait();
      }

      onMintStateChanged(MintState.MINTING);
      await (await wrappedReaper.mint(stake, maxPrice)).wait();
    },
    [wrappedReaperContractAddress, provider, reapersGambitContractAddress, account]
  );

  React.useEffect(() => void refreshState(), [refreshState]);

  return React.useMemo(
    () => ({...state, refreshState, burn, mint}),
    [state, refreshState, burn, mint],
  );
}
