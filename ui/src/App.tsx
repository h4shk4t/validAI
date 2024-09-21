import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import CodePage from "@/pages/code";
import Callback from "./pages/callback";
import Repos from "./pages/repos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/code" element={<CodePage />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/repos" element={<Repos />} />
      </Routes>
    </Router>
  );
}

export default App;
