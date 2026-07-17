import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DraftBoard from "../../components/draft/DraftBoard";
import DraftFlow from "../../components/draft/DraftFlow";
import DraftTimer from "../../components/draft/DraftTimer";

import { generateDraftOrder } from "../../utils/draftGenerator";
import { getActionText } from "../../draftLogic";

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

import "../../styles/observer/DraftOverlay.css";

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

export default function DraftOverlay() {

    const [searchParams] = useSearchParams();

    const tournamentId =
        searchParams.get("tournament");

    const [draftState, setDraftState] =
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
                setDraftState
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

            document.body.style.background = "";

            document.documentElement.style.background = "";

        };

    }, [tournamentId]);

    if (

        !draftState ||

        !settings ||

        !broadcastSettings

    ) {

        return (

            <div className="draft-overlay-loading">

                Waiting for Draft...

            </div>

        );

    }

    const {

        draft,

        step,

        team1Name,
        team2Name,

        team1Logo,
        team2Logo,

        running,
        time,

    } = draftState;

    const {

        draftVariant = "snake",

        picksPerTeam = 3,

        bansPerTeam = 1,

        firstTeam = 1,

        customDraftOrder = [],

    } = settings;

    const draftOrder =

        draftVariant === "custom"

            ? customDraftOrder

            : generateDraftOrder(

                  draftVariant,

                  picksPerTeam,

                  bansPerTeam,

                  firstTeam

              );

    const currentAction =
        draftOrder[step];

    return (

        <div className="draft-overlay">

            <div className="overlay-header">

                <div className="overlay-team">

                    {team1Logo && (

                        <img

                            src={team1Logo}

                            alt=""

                            className="overlay-logo"

                        />

                    )}

                    <h2>

                        {team1Name}

                    </h2>

                </div>

                <div className="overlay-title">

                    LIVE DRAFT

                </div>

                <div className="overlay-team right">

                    <h2>

                        {team2Name}

                    </h2>

                    {team2Logo && (

                        <img

                            src={team2Logo}

                            alt=""

                            className="overlay-logo"

                        />

                    )}

                </div>

            </div>

            <div className="overlay-top">

                <DraftBoard

                    side="left"

                    title="Picks & Bans"

                    draft={

                        draft.filter(

                            x =>

                                x.team === 1

                        )

                    }

                />

                {

                    broadcastSettings.showTimer && (

                        <DraftTimer

                            currentAction={

                                currentAction

                                    ? getActionText(

                                          currentAction

                                      )

                                          .replace(

                                              "Team 1",

                                              team1Name

                                          )

                                          .replace(

                                              "Team 2",

                                              team2Name

                                          )

                                    : "Draft Complete"

                            }

                            running={running}

                            time={time}

                            showControls={false}

                        />

                    )

                }

                <DraftBoard

                    side="right"

                    title="Picks & Bans"

                    draft={

                        draft.filter(

                            x =>

                                x.team === 2

                        )

                    }

                />

            </div>

            {

                broadcastSettings.showDraftFlow && (

                    <DraftFlow

                        draft={draft}

                        team1Name={team1Name}

                        team2Name={team2Name}

                    />

                )

            }

        </div>

    );

}
