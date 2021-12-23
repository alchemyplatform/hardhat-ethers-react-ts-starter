import React from 'react';
import ReactDOM from 'react-dom';

import { Web3ReactProvider } from '@web3-react/core';

import './index.css';

import { App } from './App';
import { getProvider } from './utils/provider';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
