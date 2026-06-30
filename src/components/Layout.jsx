import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="layout">

      <header className="topbar">

        <div>
          <h1> Arkheron Tournament Manager</h1>
        </div>

        <nav className="nav">

          <NavLink to="/">
            Dashboard
          </NavLink>

          <NavLink to="/draft">
            Draft
          </NavLink>

          <NavLink to="/builder">
            Team Builder
          </NavLink>

          <NavLink to="/settings">
            Settings
          </NavLink>

        </nav>

      </header>

      <main className="content">

        {children}

      </main>

    </div>
  );
}