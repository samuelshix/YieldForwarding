import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WagmiConfig, createClient, configureChains, defaultChains, useAccount, useEnsName } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"
import { InjectedConnector } from 'wagmi/connectors/injected';

function App() {
  // const alchemyId = process.env.ALCHEMY_ID
  const { address, isConnected } = useAccount()
  return (

    <>
      <Header address={address} isConnected={isConnected} />
      <Container maxWidth="md">
        <Main userAddress={address} isConnected={isConnected} />
      </Container>
    </>
  )
}

export default App;
