import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

const pages = [

    {
        title: "🎴 Draft",
        description:
            "Run tournament drafts with customizable pick and ban orders, timers, team logos, and automatic save recovery.",
        path: "/draft",
    },

    {
        title: "⚔️ Team Builder",
        description:
            "Create tournament loadouts and experiment with different Eternal combinations.",
        path: "/builder",
        disabled: true,
    },

    {
        title: "📺 Observer",
        description:
            "Launch browser source overlays for OBS including the live scoreboard and draft overlay.",
        path: "/observer",
    },

    {
        title: "🏆 Tournament Manager",
        description:
            "Create tournaments, manage teams, brackets and match progression.",
        path: "/tournament",
        disabled: true,
    },

    {
        title: "📊 Statistics",
        description:
            "Analyze pick rates, bans, team performance and tournament trends.",
        path: "/stats",
        disabled: true,
    },

    {
        title: "⚙️ Settings",
        description:
            "Configure tournament defaults, draft rules and application preferences.",
        path: "/settings",
    },

];

export default function Dashboard() {

    return (

        <div className="dashboard">

            <div className="dashboard-header card">

                <h1>
                    Arkheron Tournament Manager
                </h1>

                <p>

                    A lightweight tournament management application for
                    Arkheron events. Designed for community tournaments,
                    custom leagues and live broadcasts.

                </p>

            </div>

            <div className="dashboard-grid">

                {pages.map((page) =>

                    page.disabled ? (

                        <div
                            key={page.title}
                            className="dashboard-card card disabled"
                        >

                            <h2>{page.title}</h2>

                            <p>{page.description}</p>

                            <span className="coming-soon">

                                Coming Soon

                            </span>

                        </div>

                    ) : (

                        <Link
                            key={page.title}
                            to={page.path}
                            className="dashboard-card card"
                        >

                            <h2>{page.title}</h2>

                            <p>{page.description}</p>

                            <div className="dashboard-action">

                                Open →

                            </div>

                        </Link>

                    )

                )}

            </div>

            <div className="dashboard-footer">

                Made by <strong>Zarazy</strong>

            </div>

        </div>

    );

}