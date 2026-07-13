import { useEffect, useState } from "react";

import {
    listenToDraft,
} from "../../firebase/draftService";

import {
    listenToSettings,
} from "../../firebase/settingsService";

import "../../styles/observer/BroadcastOverlay.css";

export default function BroadcastOverlay() {

    const [draft, setDraft] = useState(null);

    const [settings, setSettings] = useState(null);

    useEffect(() => {

        document.body.style.background =
            "transparent";

        document.documentElement.style.background =
            "transparent";

        const unsubscribeDraft =
            listenToDraft(setDraft);

        const unsubscribeSettings =
            listenToSettings(setSettings);

        return () => {

            unsubscribeDraft();

            unsubscribeSettings();

            document.body.style.background = "";

            document.documentElement.style.background = "";

        };

    }, []);

    if (!draft || !settings) {

        return (

            <div className="broadcast-loading">

                Waiting for Draft...

            </div>

        );

    }

    const tournamentName =
        settings.tournamentName ||
        "Arkheron Tournament";

    const seriesLength =
        settings.seriesLength || 5;

    return (

        <div className="broadcast">

            <div className="broadcast-wrapper">

                <div className="broadcast-tournament">

                    {tournamentName}

                </div>

                <div className="broadcast-bar">

                    <div className="broadcast-team left">

                        {draft.team1Logo && (

                            <img
                                src={draft.team1Logo}
                                className="broadcast-logo"
                                alt=""
                            />

                        )}

                        <div className="broadcast-name">

                            {draft.team1Name}

                        </div>

                        <div className="broadcast-score blue">

                            {draft.score.team1}

                        </div>

                    </div>

                    <div className="broadcast-center">

                        <div className="broadcast-game">

                            GAME {draft.game}

                        </div>

                        <div className="broadcast-series">

                            BEST OF {seriesLength}

                        </div>

                    </div>

                    <div className="broadcast-team right">

                        <div className="broadcast-score red">

                            {draft.score.team2}

                        </div>

                        <div className="broadcast-name">

                            {draft.team2Name}

                        </div>

                        {draft.team2Logo && (

                            <img
                                src={draft.team2Logo}
                                className="broadcast-logo"
                                alt=""
                            />

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}