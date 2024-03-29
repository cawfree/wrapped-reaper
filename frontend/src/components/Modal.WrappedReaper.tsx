import * as React from 'react';

import {useWrappedReaperDeploymentSettings} from '../hooks';

import {Modal} from './Modal';

export const ModalWrappedReaper = React.memo(
  function ModalWrappedReaper(props: Omit<Parameters<typeof Modal>[0], 'children'>) {
    const {wrappedReaperEtherscanLink, reapersGambitEtherscanLink} = useWrappedReaperDeploymentSettings();
    return (
      <Modal {...props} label="Wrapped Reaper">
          <p><a href={wrappedReaperEtherscanLink} target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">WRAPPED REAPER</a> is an auxiliary contract to the REAPER'S GAMBIT which enables holders to safeguard their $RG inside an immortal NFT which cannot be put to death by The Reaper. Callers must stake a minumum of 666,666 $RG in order to be eligible for a token, in addition to paying a tribute whose pricing follows the <a href="https://twitter.com/figure31_/status/1657861433961463809" target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">SCYTHE CURVE</a>. Tributes are immediately sent to the burn address.</p>
          <p> The tokens created reward both the <i>commitment</i> and <i>wrecklessness</i> of the minter, and can be burned to redeem the locked $RG -  just be careful not to redeem the tokens to a dead address...</p>
          <p className="mb-0">Similar to <a href={reapersGambitEtherscanLink} target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">REAPER'S GAMBIT</a>, the contract is verified and tested, but it is not audited. It is entirely generated by an <a href="https://twitter.com/figure31_/status/1670856437184987144" target="_blank" rel="noreferrer noopener" className="hover:underline font-bold">ANON DEGEN</a>. Use at your own risk and ensure you understand how it works.</p>
      </Modal>
    );
  }
);
