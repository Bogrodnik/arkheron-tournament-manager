import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {

    listenToBroadcastSettings,

    updateBroadcastSettings,

    listenToTournamentBroadcastSettings,

    updateTournamentBroadcastSettings,

    DEFAULT_SETTINGS,

} from "../firebase/broadcastSettingsService";

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

    const { tournamentId } = useParams();

    const [broadcastSettings, setBroadcastSettings] =

        useState(DEFAULT_SETTINGS);

    useEffect(() => {

        const unsubscribe = tournamentId
            ? listenToTournamentBroadcastSettings(
                tournamentId,
                setBroadcastSettings
            )
            : listenToBroadcastSettings(
                setBroadcastSettings
            );

        return unsubscribe;

    }, [tournamentId]);

    async function updateSettings(updates) {

        if (tournamentId) {

            await updateTournamentBroadcastSettings(
                tournamentId,
                updates
            );

            return;

        }

        await updateBroadcastSettings(updates);

    }

    async function toggle(setting) {

        await updateSettings({

            [setting]:

                !broadcastSettings[setting],

        });

    }

    async function setPreset(preset) {

        switch (preset) {

            case "minimal":

                await updateSettings({

                    ...DEFAULT_SETTINGS,

                    showLogos: false,

                    showSeriesBar: false,

                    showPicksBans: false,

                    showTimer: false,

                    showDraftFlow: false,

                });

                break;

            case "gameplay":

                await updateSettings({

                    ...DEFAULT_SETTINGS,

                    showTimer: false,

                    showDraftFlow: false,

                });

                break;

            case "draft":

                await updateSettings({

                    ...DEFAULT_SETTINGS,

                    showSeriesBar: false,

                });

                break;

            case "full":

                await updateSettings(

                    DEFAULT_SETTINGS

                );

                break;

        }

    }

    function getOverlayRoute(route) {

        if (!tournamentId) {

            return route;

        }

        return `${route}?tournament=${encodeURIComponent(tournamentId)}`;

    }

    function buildUrl(route) {

        return `${window.location.origin}${window.location.pathname}#${getOverlayRoute(route)}`;

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

            </p>

        </div>

        <div className="observer-grid">

            {overlays.map(overlay => (

                <div

                    key={overlay.route}

                    className={`observer-card ${
                        overlay.route === "/overlay/broadcast"
                            ? "broadcast-card"
                            : ""
                    }`}

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

                                    `#${getOverlayRoute(overlay.route)}`,

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

                    {overlay.route === "/overlay/broadcast" && (

                        <>

                            <hr

                                style={{

                                    margin: "18px 0",

                                    opacity: .15,

                                }}

                            />

                            <h3>

                                Broadcast Presets

                            </h3>

                            <div className="observer-actions">

                                <button

                                    className="secondary-button"

                                    onClick={() =>

                                        setPreset(

                                            "minimal"

                                        )

                                    }

                                >

                                    Minimal

                                </button>

                                <button

                                    className="secondary-button"

                                    onClick={() =>

                                        setPreset(

                                            "gameplay"

                                        )

                                    }

                                >

                                    Gameplay

                                </button>

                                <button

                                    className="secondary-button"

                                    onClick={() =>

                                        setPreset(

                                            "draft"

                                        )

                                    }

                                >

                                    Draft

                                </button>

                                <button

                                    className="primary-button"

                                    onClick={() =>

                                        setPreset(

                                            "full"

                                        )

                                    }

                                >

                                    Full

                                </button>

                            </div>

                            <hr

                                style={{

                                    margin: "18px 0",

                                    opacity: .15,

                                }}

                            />

                            <h3>

                                Broadcast Controls

                            </h3>

                            <div className="broadcast-controls">

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showLeftTeam}

                                        onChange={() =>

                                            toggle(

                                                "showLeftTeam"

                                            )

                                        }

                                    />

                                    Left Team

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showRightTeam}

                                        onChange={() =>

                                            toggle(

                                                "showRightTeam"

                                            )

                                        }

                                    />

                                    Right Team

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showLogos}

                                        onChange={() =>

                                            toggle(

                                                "showLogos"

                                            )

                                        }

                                    />

                                    Team Logos

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showNames}

                                        onChange={() =>

                                            toggle(

                                                "showNames"

                                            )

                                        }

                                    />

                                    Team Names

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showScores}

                                        onChange={() =>

                                            toggle(

                                                "showScores"

                                            )

                                        }

                                    />

                                    Scores

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showSeriesBar}

                                        onChange={() =>

                                            toggle(

                                                "showSeriesBar"

                                            )

                                        }

                                    />

                                    Series Progress

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showPicksBans}

                                        onChange={() =>

                                            toggle(

                                                "showPicksBans"

                                            )

                                        }

                                    />

                                    Picks / Bans

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showTimer}

                                        onChange={() =>

                                            toggle(

                                                "showTimer"

                                            )

                                        }

                                    />

                                    Draft Timer

                                </label>

                                <label>

                                    <input

                                        type="checkbox"

                                        checked={broadcastSettings.showDraftFlow}

                                        onChange={() =>

                                            toggle(

                                                "showDraftFlow"

                                            )

                                        }

                                    />

                                    Draft Flow

                                </label>

                            </div>

                        </>

                    )}

                </div>

            ))}

        </div>

    </div>

);

}
