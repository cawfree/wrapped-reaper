import * as React from 'react';
import {OwnedNft} from 'alchemy-sdk';
import {ethers} from 'ethers';

import {getStake} from '../utils';

import {Modal} from './Modal';
import {Input} from "./Input";
import {Button} from "./Button";
import {useWrappedReaperDeploymentSettings} from "../hooks";
import {Ellipses} from "./Ellipses";

export const ModalBurn = React.memo(
  function ModalBurn({
    nftToBurn,
    onChangeNftToBurn,
    onRequestBurn,
  }: {
    readonly nftToBurn: OwnedNft | undefined;
    readonly onChangeNftToBurn: (nftToBurn: OwnedNft | undefined) => void;
    readonly onRequestBurn: (toAddress: string) => Promise<void>;
  }): JSX.Element {
    const [address, setAddress] = React.useState('');
    const [isBurning, setIsBurning] = React.useState<boolean>(false);

    const {forceUpdateUri} = useWrappedReaperDeploymentSettings();

    const submitDisabled = (!ethers.utils.isAddress(address)) || isBurning;

    const onClickBurn = React.useCallback(
      async () => {
        try {
          const maybeTokenId = nftToBurn?.tokenId;

          if (typeof maybeTokenId !== 'string' || !maybeTokenId.length)
            throw new Error(`Expected non-empty string maybeTokenId, encountered "${String(maybeTokenId)}".`);

          setIsBurning(true);
          await onRequestBurn(address);
          await fetch(forceUpdateUri(maybeTokenId)).catch(console.error);
          onChangeNftToBurn(undefined);
        } catch (e) {
          console.error(e);
        } finally {
          setIsBurning(false);
        }
      },
      [onRequestBurn, onChangeNftToBurn, address, forceUpdateUri, nftToBurn]
    );

    return (
      <Modal
        label={`Burn ${nftToBurn?.title}`}
        isActive={!!nftToBurn}
        // TODO: remove this indirection
        setIsActive={(nextIsActive) => onChangeNftToBurn(nextIsActive ? nftToBurn : undefined)}
        dismissable={!isBurning}
      >
        <p>Wrapped Reaper can be burned in exchange for the staked $RG that they contain. When you burn a token, the token is lost forever and the $RG it contains is sent to an address of your choosing. <i>Beware</i>, it is possible to redeem tokens to an address that has already died...</p>
        <p>#{nftToBurn?.tokenId} is redeemable for <b>{getStake(nftToBurn)} $RG</b></p>
        <Input autoFocus placeholder="0x" value={address} onChange={setAddress} disabled={isBurning} />
        <Button disabled={submitDisabled} onClick={onClickBurn}>
          {isBurning ? <Ellipses children="Burning" /> : 'Burn'}
        </Button>
      </Modal>
    );
  }
);
