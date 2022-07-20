import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ChainId, DAppProvider, Localhost } from "@usedapp/core"
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"
function App() {
  return (

    <DAppProvider config={{
      supportedChains: [ChainId.Rinkeby],
      readOnlyChainId: ChainId.Rinkeby,
      multicallAddresses: {
        [ChainId.Rinkeby]: "0x22c45Ad85f1dBfC4BbF0B393874fb94668Ce2a4D"
      },
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header />
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  )
}

export default App;
