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
        🏠 Dashboard
    </NavLink>

    <NavLink to="/draft">
        🎴 Eternal Draft
    </NavLink>

    <span className="nav-disabled">
        ⚔️ Team Builder
    </span>

    <span className="nav-disabled">
        🏆 Tournament Manager
    </span>

    <span className="nav-disabled">
        📺 Observer Overlay
    </span>

    <span className="nav-disabled">
        📊 Statistics
    </span>

    <NavLink to="/settings">
        ⚙️ Settings
    </NavLink>

</nav>

      </header>

      <main className="content">

        {children}

      </main>

    </div>
  );
}