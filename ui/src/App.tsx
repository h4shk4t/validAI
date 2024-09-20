import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home";
import DashboardPage from "@/pages/dashboard";
import CodePage from "@/pages/code";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/code" element={<CodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
