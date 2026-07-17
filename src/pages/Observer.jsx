import { useEffect, useMemo, useState } from "react";
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

        route: "/overlay",

    },

    {

        icon: "🎮",

        title: "Gameplay Draft Overlay",

        description:

            "Minimal gameplay overlay showing live picks and bans.",

        route: "/overlay-v2",

    },

    {

        icon: "🃏",

        title: "Draft Overlay",

        description:

            "Displays the live draft, timer, draft order, picks and bans.",

        route: "/overlay/draft",

    },

];

const broadcastPresets = {

    minimal: {
        ...DEFAULT_SETTINGS,
        showLogos: false,
        showSeriesBar: false,
        showPicksBans: false,
        showTimer: false,
        showDraftFlow: false,
    },
    gameplay: {
        ...DEFAULT_SETTINGS,
        showTimer: false,
        showDraftFlow: false,
    },
    draft: {
        ...DEFAULT_SETTINGS,
        showSeriesBar: false,
    },
    full: {
        ...DEFAULT_SETTINGS,
    },

};

export default function Observer() {

    const { tournamentId } = useParams();

    const generatedRoutes = useMemo(() => {

        const encodedTournamentId = tournamentId
            ? encodeURIComponent(tournamentId)
            : "";

        const suffix = encodedTournamentId
            ? `/${encodedTournamentId}`
            : "";

        return {
            draft: `/draft${suffix}`,
            settings: `/settings${suffix}`,
            overlay: `/overlay${suffix}`,
            overlayV2: `/overlay-v2${suffix}`,
            draftOverlay: `/overlay/draft${suffix}`,
        };

    }, [tournamentId]);

    const [broadcastSettings, setBroadcastSettings] =

        useState(DEFAULT_SETTINGS);

    const activePreset = useMemo(() => {

        return Object.entries(broadcastPresets).find(
            ([, presetSettings]) =>
                Object.entries(presetSettings).every(
                    ([key, value]) =>
                        broadcastSettings[key] === value
                )
        )?.[0] || null;

    }, [broadcastSettings]);

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

        const presetSettings =
            broadcastPresets[preset];

        if (!presetSettings) {

            return;

        }

        await updateSettings(presetSettings);

    }

    function getOverlayRoute(route) {

        if (route === "/overlay") {

            return generatedRoutes.overlay;

        }

        if (route === "/overlay-v2") {

            return generatedRoutes.overlayV2;

        }

        if (route === "/overlay/draft") {

            return generatedRoutes.draftOverlay;

        }

        return route;

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

        <div className="observer-card observer-control-card">

            <div className="observer-control-header">

                <div>

                    <h2>
                        Broadcast Controls
                    </h2>

                    <p>
                        Choose a preset and fine-tune what the live broadcast overlays display.
                    </p>

                </div>

            </div>

            <div className="observer-control-groups">

                <section className="observer-control-section">

                    <h3>
                        Broadcast Presets
                    </h3>

                    <div className="observer-actions observer-presets">

                        {Object.keys(broadcastPresets).map(
                            preset => (

                                <button
                                    key={preset}
                                    className={`observer-preset-button ${
                                        activePreset === preset
                                            ? "observer-preset-button-active"
                                            : "observer-preset-button-inactive"
                                    }`}
                                    aria-pressed={activePreset === preset}
                                    onClick={() =>
                                        setPreset(preset)
                                    }
                                >
                                    {preset.charAt(0).toUpperCase() + preset.slice(1)}
                                </button>

                            )
                        )}

                    </div>

                </section>

                <section className="observer-control-section">

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

                </section>

            </div>

        </div>

        <div className="observer-grid">

            {overlays.map(overlay => (

                <div

                    key={overlay.route}

                    className="observer-card observer-overlay-card"

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

                </div>

            ))}

        </div>

    </div>

);

}
