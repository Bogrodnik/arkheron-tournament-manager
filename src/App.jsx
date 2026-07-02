/*
=========================================
Router Imports
=========================================
*/

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

/*
=========================================
Page Imports
=========================================
*/

import Dashboard from "./pages/Dashboard";
import Draft from "./pages/Draft";
import TeamBuilder from "./pages/TeamBuilder";
import TournamentSettings from "./pages/TournamentSettings";

/*
=========================================
Layout Import
=========================================
*/

import Layout from "./components/Layout";

/*
=========================================
App
=========================================
*/

export default function App() {
  return (
    <BrowserRouter>

      <Layout>

        <Routes>

          {/* Dashboard */}

          <Route
            path="/"
            element={
              <Dashboard />
            }
          />

          {/* Draft */}

          <Route
            path="/draft"
            element={
              <Draft />
            }
          />

          {/* Team Builder */}

          <Route
            path="/builder"
            element={
              <TeamBuilder />
            }
          />

          {/* Tournament Rules */}

          <Route
            path="/tournament-settings"
            element={
              <TournamentSettings />
            }
          />

          {/* Application Settings */}

          <Route
              path="/settings"
              element={<TournamentSettings />}
          />

        </Routes>

      </Layout>

    </BrowserRouter>
  );
}