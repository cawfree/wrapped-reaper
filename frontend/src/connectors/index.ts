import {Web3ReactHooks} from '@web3-react/core';
import {MetaMask} from '@web3-react/metamask';

import {metaMask, hooks as metamaskHooks} from './metamask';

type Connectors = [{
  providerArguments: [MetaMask, Web3ReactHooks],
  label: string
}];

const connectors: Connectors = [{
  providerArguments: [metaMask, metamaskHooks],
  label: 'MetaMask',
}];

export default connectors;
