import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Draft from "./pages/Draft";
import TeamBuilder from "./pages/TeamBuilder";
import Settings from "./pages/Settings";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {

  return (

    <div className="app">

      <Sidebar />

      <main className="content">

        <Header />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/draft" element={<Draft />} />

          <Route path="/builder" element={<TeamBuilder />} />

          <Route path="/settings" element={<Settings />} />

        </Routes>

      </main>

    </div>

  );

}

export default App;