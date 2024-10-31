import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import CodePage from "@/pages/code";
import MarketplacePage from "@/pages/marketplace";
import Callback from "./pages/callback";
import Repos from "./pages/repos";
import Dynamic from "./pages/dyanmic";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Apps from "./pages/apps";
import Rag from "./pages/rag";


function App() {
  return (
    <DynamicContextProvider
      theme={"dark"}
      settings={{
        environmentId: "9548d0dd-8ac0-4174-b30a-7304bd3e8ee9",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/code" element={<CodePage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/dynamic" element={<Dynamic />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/rag" element={<Rag />} />
        </Routes>
      </Router>
    </DynamicContextProvider>
  );
}

export default App;
