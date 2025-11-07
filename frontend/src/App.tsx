import { Header } from "./components/header"
import { Hero } from "./components/hero"
import { ConnectWallet } from "./components/connect-wallet"

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId:import.meta.env.VITE_DYNAMIC_XYZ_ID,
        walletConnectors:[EthereumWalletConnectors]
      }}
    >
      <div className="w-full min-h-screen container mx-auto px-4 py-4">
        <Header githubLink="https://github.com/germanllop/legacy-fe-candidate-assignment" />
        <Hero />
        <ConnectWallet />
      </div>
    </DynamicContextProvider>
  )
}

export default App
