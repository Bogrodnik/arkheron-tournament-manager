import "../styles/Dashboard.css";
import { Link } from "react-router-dom";

const pages = [
    {
        title: "🎴 Eternal Draft",
        description:
            "Tournament draft system supporting picks, bans, timers, series tracking, and observer tools.",
        path: "/draft",
    },

    {
        title: "⚔️ Team Builder",
        description:
            "Build tournament legal loadouts including weapons, anchors, crowns, consumables, and set bonuses.",
        path: "/builder",
        disabled: true,
    },

    {
        title: "🏆 Tournament Manager",
        description:
            "Manage brackets, team registration, match scheduling, and results tracking.",
        path: "/tournament",
        disabled: true,
    },

    {
        title: "📺 Observer Overlay",
        description:
            "Generate stream-ready overlays for casters and tournament broadcasts.",
        path: "/observer",
        disabled: true,
    },

    {
        title: "📊 Statistics",
        description:
            "View pick rates, ban rates, team trends, and tournament analytics.",
        path: "/stats",
        disabled: true,
    },

    {
        title: "⚙️ Settings",
        description:
            "Configure application settings, tournament rules, themes, and defaults.",
        path: "/settings",
    },
];

export default function Dashboard() {
    return (
        <div className="dashboard">

            <div className="dashboard-header card">

                <h1>
                    Dashboard
                </h1>

                <p>
                    Professional tournament tools for
                    Arkheron events, broadcasts,
                    leagues, and community competitions.
                </p>

            </div>

            <div className="dashboard-grid">

                {pages.map((page) =>

                    page.disabled ? (
                        <div
                            key={page.title}
                            className="dashboard-card card disabled"
                        >
                            <h2>
                                {page.title}
                            </h2>

                            <p>
                                {page.description}
                            </p>

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
                            <h2>
                                {page.title}
                            </h2>

                            <p>
                                {page.description}
                            </p>

                            <div className="dashboard-action">
                                Open →
                            </div>
                        </Link>
                    )

                )}

            </div>
            <div className="dashboard-footer">

    Made with ❤️ for the Arkheron community by
    <span className="dashboard-author">
        {" "}Zarazy
    </span>

</div>

        </div>
    );
}