import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    listenToDraft,
    listenToTournamentDraft,
} from "../../firebase/draftService";

import {
    listenToSettings,
    listenToTournamentSettings,
} from "../../firebase/settingsService";

import {

    listenToBroadcastSettings,

    listenToTournamentBroadcastSettings,

    DEFAULT_SETTINGS,

} from "../../firebase/broadcastSettingsService";

import TeamHUD from "../../components/observer/TeamHUD";

import "../../styles/observer/BroadcastOverlay.css";

import BOBarPortrait from "../../assets/BO_Bar_Portrait.png";

function subscribeToDraft(tournamentId, callback) {

    return tournamentId
        ? listenToTournamentDraft(
            tournamentId,
            callback
        )
        : listenToDraft(callback);

}

function subscribeToSettings(tournamentId, callback) {

    return tournamentId
        ? listenToTournamentSettings(
            tournamentId,
            callback
        )
        : listenToSettings(callback);

}

function subscribeToBroadcastSettings(
    tournamentId,
    callback
) {

    return tournamentId
        ? listenToTournamentBroadcastSettings(
            tournamentId,
            callback
        )
        : listenToBroadcastSettings(callback);

}

export default function BroadcastOverlay() {

    const [searchParams] = useSearchParams();

    const tournamentId =
        searchParams.get("tournament");

    const [draft, setDraft] =
        useState(null);

    const [settings, setSettings] =
        useState(null);

    const [broadcastSettings, setBroadcastSettings] =
        useState(DEFAULT_SETTINGS);

    useEffect(() => {

        document.body.style.background =
            "transparent";

        document.documentElement.style.background =
            "transparent";

        const unsubscribeDraft =
            subscribeToDraft(
                tournamentId,
                setDraft
            );

        const unsubscribeSettings =
            subscribeToSettings(
                tournamentId,
                setSettings
            );

        const unsubscribeBroadcast =
            subscribeToBroadcastSettings(
                tournamentId,
                setBroadcastSettings
            );

        return () => {

            unsubscribeDraft();

            unsubscribeSettings();

            unsubscribeBroadcast();

            document.body.style.background =
                "";

            document.documentElement.style.background =
                "";

        };

    }, [tournamentId]);

    if (

        !draft ||

        !settings ||

        !broadcastSettings

    ) {

        return (

            <div className="broadcast-loading">

                Waiting for Draft...

            </div>

        );

    }

    const seriesLength =
        settings.seriesLength || 5;

    return (

        <div className="broadcast">

            <div className="broadcast-wrapper">
                
                <div className="broadcast-layout">

                    {

                        broadcastSettings.showLeftTeam && (

                            <TeamHUD

                                side="left"

                                logo={draft.team1Logo}

                                name={draft.team1Name}

                                score={draft.score.team1}

                                seriesLength={seriesLength}

                                draft={

                                    draft.draft.filter(

                                        item =>

                                            item.team === 1

                                    )

                                }

                                settings={broadcastSettings}

                            />

                        )

                    }

                    {

                        broadcastSettings.showRightTeam && (

                            <TeamHUD

                                side="right"

                                logo={draft.team2Logo}

                                name={draft.team2Name}

                                score={draft.score.team2}

                                seriesLength={seriesLength}

                                draft={

                                    draft.draft.filter(

                                        item =>

                                            item.team === 2

                                    )

                                }

                                settings={broadcastSettings}

                            />

                        )

                    }

                </div>

            </div>

        </div>

    );

}
