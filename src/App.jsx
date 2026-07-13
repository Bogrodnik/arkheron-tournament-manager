import {
    HashRouter,
    Routes,
    Route,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Draft from "./pages/Draft";
import TeamBuilder from "./pages/TeamBuilder";
import TournamentSettings from "./pages/TournamentSettings";
import Observer from "./pages/Observer";

import DraftOverlayV2 from "./pages/observer/DraftOverlayV2";
import BroadcastOverlay from "./pages/observer/BroadcastOverlay";
import DraftOverlay from "./pages/observer/DraftOverlay";

export default function App() {

    return (

        <HashRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/draft"
                        element={<Draft />}
                    />

                    <Route
                        path="/builder"
                        element={<TeamBuilder />}
                    />

                    <Route
                        path="/observer"
                        element={<Observer />}
                    />

                    <Route
                        path="/settings"
                        element={
                            <TournamentSettings />
                        }
                    />

                    <Route
                        path="/tournament-settings"
                        element={
                            <TournamentSettings />
                        }
                    />

                    <Route
                        path="/overlay/broadcast"
                        element={
                            <BroadcastOverlay />
                        }
                    />
                    <Route
                        path="/overlay/draft-v2"
                        element={<DraftOverlayV2 />}
                    />
                    <Route
                        path="/overlay/draft"
                        element={
                            <DraftOverlay />
                        }
                    />

                </Route>

            </Routes>

        </HashRouter>

    );

}