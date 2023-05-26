import * as React from 'react';
import {BigNumber} from 'ethers';
import {useDebounce} from 'use-debounce';

import {useCurrentScythe, useWrappedReaperDeploymentSettings} from '../hooks';

import {MintState, WrappedReaperState} from '../@types';
import {isStatefulResult, reinstateDecimalComponent, stripDecimalComponent} from '../utils';

import {Modal} from './Modal';
import {Input} from './Input';
import {Button} from './Button';
import {ModalMintMintStateSpan} from './Modal.Mint.MintStateSpan';

export const ModalMint = React.memo(
  function ModalMint({
    mintState,
    onRequestMint: defaultOnRequestMint,
    setIsActive,
    wrappedReaperState,
    ...extras
  }: Omit<Parameters<typeof Modal>[0], 'children' | 'label'> & {
   readonly mintState: MintState | undefined;
   readonly onRequestMint: (stake: BigNumber) => Promise<void>;
   readonly wrappedReaperState: WrappedReaperState;
  }): JSX.Element {
    const {reapersGambitEtherscanLink, wrappedReaperEtherscanLink} = useWrappedReaperDeploymentSettings();
    const {minStake, maxStake, decimals} = wrappedReaperState;

    const [integerValue, setIntegerValue] = React.useState<string>(String(stripDecimalComponent(minStake, decimals)));
    const [isMinting, setIsMinting] = React.useState(false);

    const onChange = React.useCallback(
      (maybeNextValue: string) => {
        try {
          const next = BigNumber.from(maybeNextValue);
          setIntegerValue(
            String(
              reinstateDecimalComponent(next, decimals).gte(maxStake)
                ? stripDecimalComponent(maxStake, decimals)
                : next,
            ),
          );
        } catch (e) {
          setIntegerValue(String(BigNumber.from('0')));
        }
      },
      [minStake, decimals, maxStake]
    );

    const stake = React.useMemo(
      () => reinstateDecimalComponent(BigNumber.from(integerValue), decimals),
      [integerValue, decimals]
    );

    const currentScythe = useCurrentScythe({
      stake,
      wrappedReaperState,
    });

    const [debouncedScythe] = useDebounce(currentScythe, 240);

    const onRequestMint = React.useCallback(
      async () => {
        setIsMinting(true);

        try {
          await defaultOnRequestMint(stake);
          setIsActive(false);
        } catch (e) {
          console.error(e);
        } finally {
          setIsMinting(false);
        }
      },
      [defaultOnRequestMint, setIsActive, stake]
    );

    const disabled = isMinting || stake.lt(minStake) || stake.gt(maxStake) || !isStatefulResult(debouncedScythe);

    return (
      <Modal {...extras} label="Mint" dismissable={!isMinting} setIsActive={setIsActive}>
        <p>When you mint <a href={wrappedReaperEtherscanLink} target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">WRAPPED REAPER</a>, both the <a href={reapersGambitEtherscanLink} target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">REAPER'S GAMBIT</a> you stake and the token itself will become unreachable by the clutches of The Reaper.</p>
        <p>However, nothing in death is free. In exchange for this promotion, minters must pay a <i>tribute</i> to the burn address, which is calculated using the <a href="https://twitter.com/figure31_/status/1657861433961463809" target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">SCYTHE CURVE</a>.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <span>
              <b>Min</b>: {String(stripDecimalComponent(minStake, decimals))} $RG
            </span>
          </div>
          <div className="text-center">
            <span>
              <b>Max</b>: {String(stripDecimalComponent(maxStake, decimals))} $RG
            </span>
          </div>
        </div>
        <div className="w-full pt-6">
          <Input
            disabled={isMinting}
            value={integerValue}
            onChange={onChange}
            placeholder=""
          />
        </div>
        <Button
          onClick={onRequestMint}
          disabled={disabled}>
          {(isMinting && (mintState !== undefined && mintState !== MintState.READYING))
            ? <ModalMintMintStateSpan mintState={mintState} />
            : `Mint${isStatefulResult(debouncedScythe) ? `(${stripDecimalComponent(debouncedScythe.result, decimals)} $RG)` : ''}`
          }
        </Button>
      </Modal>
    );
  }
);
