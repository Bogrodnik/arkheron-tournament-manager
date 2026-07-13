import {
    NavLink,
    Outlet,
    useLocation,
} from "react-router-dom";

export default function Layout() {

    const location =
        useLocation();

    const isOverlay =
        location.pathname.startsWith(
            "/overlay"
        );

    if (isOverlay) {

        return <Outlet />;

    }

    return (

        <div className="layout">

            <header className="topbar">

                <div>

                    <h1>
                        Arkheron Tournament Manager
                    </h1>

                </div>

                <nav className="nav">

                    <NavLink to="/">
                        🏠 Dashboard
                    </NavLink>

                    <NavLink to="/draft">
                        🎴 Draft
                    </NavLink>

                    <span className="nav-disabled">
                        ⚔️ Team Builder
                    </span>

                    <span className="nav-disabled">
                        🏆 Tournament Manager
                    </span>

                    <NavLink to="/observer">
                        📺 Observer
                    </NavLink>

                    <span className="nav-disabled">
                        📊 Statistics
                    </span>

                    <NavLink to="/settings">
                        ⚙️ Settings
                    </NavLink>

                </nav>

            </header>

            <main className="content">

                <Outlet />

            </main>

        </div>

    );

}