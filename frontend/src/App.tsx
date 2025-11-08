import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { Home } from "./pages/home";

function App() {
  return (
    // DynamicContextProvider bootstraps the SDK so nested pages can focus on features
    <DynamicContextProvider
      settings={{
        environmentId:import.meta.env.VITE_DYNAMIC_XYZ_ID,
        walletConnectors:[EthereumWalletConnectors]
      }}
    >
      <Home />
    </DynamicContextProvider>
  )
}

export default App
