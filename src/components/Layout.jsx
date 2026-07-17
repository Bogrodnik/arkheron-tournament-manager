import { useEffect, useMemo, useState } from "react";
import {
    NavLink,
    Outlet,
    useLocation,
    useParams,
} from "react-router-dom";

import { listenToTournament } from "../firebase/tournamentService";
import { buildTournamentAwarePath } from "../utils/tournamentRoutes";
import { saveTournamentNavigationState } from "../utils/tournamentNavigationState";

const navItems = [
    {
        key: "dashboard",
        label: "Dashboard",
        to: "/",
        disabled: false,
    },
    {
        key: "settings",
        label: "Settings",
        to: "/settings",
        disabled: false,
    },
    {
        key: "observer",
        label: "Observer",
        to: "/observer",
        disabled: false,
    },
    {
        key: "draft",
        label: "Draft",
        to: "/draft",
        disabled: false,
    },
    {
        key: "team-builder",
        label: "Team Builder",
        to: null,
        disabled: true,
    },
    {
        key: "tournament-manager",
        label: "Tournament Manager",
        to: null,
        disabled: true,
    },
    {
        key: "statistics",
        label: "Statistics",
        to: null,
        disabled: true,
    },
];

function getTournamentTrackedPage(pathname) {

    if (pathname.startsWith("/settings")) {

        return "settings";

    }

    if (pathname.startsWith("/observer")) {

        return "observer";

    }

    if (pathname.startsWith("/draft")) {

        return "draft";

    }

    return null;

}

function formatTournamentStatus(status) {

    if (!status) {

        return "Active";

    }

    return status.charAt(0).toUpperCase() + status.slice(1);

}

export default function Layout() {

    const location = useLocation();
    const { tournamentId } = useParams();
    const [tournament, setTournament] = useState(null);

    const isOverlay =
        location.pathname.startsWith(
            "/overlay"
        ) ||
        location.pathname.startsWith(
            "/broadcast"
        );

    useEffect(() => {

        if (!tournamentId) {

            setTournament(null);
            return undefined;

        }

        return listenToTournament(
            tournamentId,
            setTournament
        );

    }, [tournamentId]);

    const activeTournamentName =
        tournament?.name || null;

    const activeTournamentStatus =
        tournament?.status || null;

    const breadcrumbSegments = useMemo(() => {

        const segments = [
            {
                label: "Dashboard",
                path: "/",
            },
        ];

        if (activeTournamentName) {

            segments.push({
                label: activeTournamentName,
                path: buildTournamentAwarePath(
                    "/",
                    tournamentId
                ),
            });
        }

        const currentPath = location.pathname;
        const currentPageLabel =
            currentPath.includes("/draft")
                ? "Draft"
                : currentPath.includes("/observer")
                    ? "Observer"
                    : currentPath.includes("/settings")
                        ? "Settings"
                        : currentPath.includes("/overlay/v2") ||
                            currentPath.includes("/overlay-v2")
                            ? "Overlay V2"
                            : currentPath.includes("/overlay")
                                ? "Overlay"
                                : "Dashboard";

        if (currentPageLabel !== "Dashboard") {

            segments.push({
                label: currentPageLabel,
                path: currentPath,
            });
        }

        return segments;

    }, [activeTournamentName, location.pathname, tournamentId]);

    const breadcrumbLabel = breadcrumbSegments
        .map(segment => segment.label)
        .join(" / ");

    const showTournamentContext = Boolean(tournamentId);

    useEffect(() => {

        if (!tournamentId || isOverlay) {

            return;

        }

        const trackedPage = getTournamentTrackedPage(
            location.pathname
        );

        if (!trackedPage) {

            return;

        }

        saveTournamentNavigationState(
            tournamentId,
            {
                lastVisitedPage: trackedPage,
                lastVisitedPath: location.pathname,
            }
        );

    }, [isOverlay, location.pathname, tournamentId]);

    if (isOverlay) {

        return <Outlet />;

    }

    return (

        <div className="layout">

            <header className="topbar">

                <div className="topbar-brand">

                    <div className="brand-title-group">

                        <h1>
                            Arkheron Tournament Manager
                        </h1>

                    </div>

                </div>

                <nav className="nav" aria-label="Primary">

                    {navItems.map(item => {

                        if (item.disabled) {

                            return (

                                <span
                                    key={item.key}
                                    className="nav-disabled"
                                >
                                    {item.label}
                                </span>

                            );

                        }

                        const to = buildTournamentAwarePath(
                            item.to,
                            tournamentId
                        );

                        return (

                            <NavLink
                                key={item.key}
                                to={to}
                            >
                                {item.label}
                            </NavLink>

                        );

                    })}

                </nav>

            </header>

            {showTournamentContext ? (

                <div className="page-context">

                    <div className="tournament-context">

                        <span className="tournament-context-badge">
                            🏆 {activeTournamentName || tournamentId}
                        </span>

                        <span className="tournament-context-status">
                            {formatTournamentStatus(
                                activeTournamentStatus
                            )}
                        </span>

                        <span className="tournament-context-breadcrumb">
                            {breadcrumbLabel}
                        </span>

                    </div>

                </div>

            ) : null}

            <main className="content">

                <Outlet />

            </main>

        </div>

    );

}