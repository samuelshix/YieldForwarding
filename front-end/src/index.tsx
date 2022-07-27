import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WagmiConfig, createClient, configureChains, defaultChains, useAccount } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import reportWebVitals from './reportWebVitals';
import { InjectedConnector } from 'wagmi/connectors/injected';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// change before prod
const alchemyId = 'ZXKftwn8JJudnknytjrJyhtTkbUjhGYN'

const { chains, provider } = configureChains(
  defaultChains, [
  alchemyProvider({ apiKey: alchemyId }),
  publicProvider(),
])
const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
})

console.log(client)
root.render(
  <WagmiConfig client={client}>
    <App />
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
