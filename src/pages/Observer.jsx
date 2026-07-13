import "../styles/Observer.css";

const overlays = [

    {
        icon: "🖥️",
        title: "Scoreboard Overlay",
        description:
            "Displays live team names, logos, match score, current game and series information.",
        route: "/overlay/broadcast",
    },

    {
        icon: "🎮",
        title: "Gameplay Draft Overlay",
        description:
            "Minimal gameplay overlay showing live picks and bans.",
        route: "/overlay/draft-v2",
    },

    {
        icon: "🃏",
        title: "Draft Overlay",
        description:
            "Displays the live draft, timer, draft order, picks and bans.",
        route: "/overlay/draft",
    },

];

export default function Observer() {

    function buildUrl(route) {

        return `${window.location.origin}${window.location.pathname}#${route}`;

    }

    function copyUrl(route) {

        navigator.clipboard.writeText(

            buildUrl(route)

        );

    }

    return (

        <div className="observer-page">

            <div className="observer-header">

                <h1>

                    Observer Tools

                </h1>

                <p>

                    Browser source overlays for OBS Studio.
                    Open an overlay in your browser or copy
                    its URL directly into an OBS Browser Source.

                </p>

            </div>

            <div className="observer-grid">

                {

                    overlays.map(

                        overlay => (

                            <div

                                key={overlay.route}

                                className="observer-card"

                            >

                                <h2>

                                    <span>

                                        {overlay.icon}

                                    </span>

                                    {overlay.title}

                                </h2>

                                <p>

                                    {overlay.description}

                                </p>

                                <code className="observer-url">

                                    {buildUrl(

                                        overlay.route

                                    )}

                                </code>

                                <div className="observer-actions">

                                    <button

                                        className="primary-button"

                                        onClick={() =>

                                            window.open(

                                                `#${overlay.route}`,

                                                "_blank"

                                            )

                                        }

                                    >

                                        Open Overlay

                                    </button>

                                    <button

                                        className="secondary-button"

                                        onClick={() =>

                                            copyUrl(

                                                overlay.route

                                            )

                                        }

                                    >

                                        Copy OBS URL

                                    </button>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

}