import * as React from 'react';

import {Modal} from './Modal';

export const ModalInfo = React.memo(
  function ModalInfo(props: Omit<Parameters<typeof Modal>[0], 'children' | 'label'>): JSX.Element {
    return (
      <Modal {...props} label="Info">
        <p>The REAPER’S GAMBIT is an on-chain conceptual artwork, an ERC20 token that becomes non-transferrable after 64800 blocks (9 days). Collectors must send their tokens to a new address before the end of this period, or their tokens will remain in limbo. The nine days countdown starts when an address first receives tokens. No address can be used twice. Escape the Reaper for as long as possible in this marathon of death.</p>
        <p>Contract: <a href="https://etherscan.io/address/0x2C91D908E9fab2dD2441532a04182d791e590f2d" className="text-[0.6rem] sm:text-base" target="_blank" rel="noreferrer noopener">0x2C91D908E9fab2dD2441532a04182d791e590f2d</a></p>
        <p>The $RG supply is 999,999,999. No more can be minted, and all have been placed in a <a href="https://v2.info.uniswap.org/pair/0x8ab0ff3106bf37b2db685aafd458baee2128d648" target="_blank" rel="noreferrer noopener">Uniswap V2 pool</a>. The LP tokens <a href="https://etherscan.io/tx/0x923a8dff61ea5f9ba9bfb9cc54b6c431794d5259eed05716381a1d76f8e0565f" target="_blank" rel="noreferrer noopener">have been burned</a>. There is no treasury or team allocation.</p>
        <p>This token is an on-chain artwork by <a href="https://twitter.com/figure31_" target="_blank" rel="noreferrer noopener">Figure31</a>. Please make sure you understand how smart contract works before interacting with it. Everyone plays by the same rules. This is an artistic experiment and should be treated as such. The smart contract is verified, but it is not audited. The title, the code, and the story of this project were entirely generated with ChatGPT. Join the community <a href="https://t.me/+Co0f1yYovp44NTU1" target="_blank" rel="noreferrer noopener">Telegram group</a> for any questions. DYOR.</p>
        <p className="mb-0">Email: info(at)reapersgambit.com</p>
      </Modal>
    );
  }
);
