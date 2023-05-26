import * as React from 'react';
import {BigNumber} from 'ethers';

import {Stateful, WrappedReaperState} from '../@types';
import {getWrappedReaperContract} from "../utils";
import {useWrappedReaperDeploymentSettings} from "./useWrappedReaperDeploymentSettings";
import {useWeb3React} from "@web3-react/core";

const loadingState = (): Stateful<BigNumber> => ({
  loading: true,
});

const invalidStakeState = (): Stateful<BigNumber> => ({
  loading: false,
  error: new Error('Invalid stake.'),
});

export function useCurrentScythe({
  stake,
  wrappedReaperState,
}: {
  readonly stake: BigNumber;
  readonly wrappedReaperState: WrappedReaperState;
}): Stateful<BigNumber> {
  const [state, setState] = React.useState<Stateful<BigNumber>>(loadingState);
  const {wrappedReaperContractAddress} = useWrappedReaperDeploymentSettings();
  const {provider} = useWeb3React();
  const {
    maxStake,
    minStake,
  } = wrappedReaperState;

  React.useEffect(
    () => void (async () => {
      setState(loadingState);
      try {
        if (stake.lt(minStake) || stake.gt(maxStake))
          return setState(invalidStakeState);

        const wrappedReaper = getWrappedReaperContract({
          wrappedReaperContractAddress,
          provider,
        });

        const [currentScythe] = await Promise.all([
          wrappedReaper.currentScythe(stake),
        ]);

        setState({loading: false, result: currentScythe});
      } catch (cause) {
        setState({loading: false, error: new Error('Unable to compute scythe.', {cause})});
      }
    })(),
    [stake, minStake, maxStake, wrappedReaperContractAddress, provider]
  );

  return state;
}
