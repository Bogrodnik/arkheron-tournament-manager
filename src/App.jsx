import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Draft from "./pages/Draft";
import TeamBuilder from "./pages/TeamBuilder";
import Settings from "./pages/Settings";

import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>

      <Layout>

        <Routes>

          <Route path="/" element={<Dashboard />} />

          <Route path="/draft" element={<Draft />} />

          <Route path="/builder" element={<TeamBuilder />} />

          <Route path="/settings" element={<Settings />} />

        </Routes>

      </Layout>

    </BrowserRouter>
  );
}