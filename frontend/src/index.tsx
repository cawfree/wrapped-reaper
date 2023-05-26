import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {Web3ReactProvider} from '@web3-react/core';
import {IntlProvider} from 'react-intl';

import App from './App';
import connectors from './connectors';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <IntlProvider locale="en-US">
      <Web3ReactProvider connectors={connectors.map(connector => connector.providerArguments)}>
        <App />
      </Web3ReactProvider>
    </IntlProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
