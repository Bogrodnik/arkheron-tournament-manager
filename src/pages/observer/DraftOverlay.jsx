import { useEffect, useState } from "react";

import DraftBoard from "../../components/draft/DraftBoard";
import DraftFlow from "../../components/draft/DraftFlow";
import DraftTimer from "../../components/draft/DraftTimer";

import { generateDraftOrder } from "../../utils/draftGenerator";
import { getActionText } from "../../draftLogic";

import {
    listenToDraft,
} from "../../firebase/draftService";

import {
    listenToSettings,
} from "../../firebase/settingsService";

import "../../styles/observer/DraftOverlay.css";

export default function DraftOverlay() {

    const [draftState, setDraftState] =
        useState(null);

    const [settings, setSettings] =
        useState(null);

    useEffect(() => {

        document.body.style.background =
            "transparent";

        document.documentElement.style.background =
            "transparent";

        const unsubscribeDraft =
            listenToDraft(setDraftState);

        const unsubscribeSettings =
            listenToSettings(setSettings);

        return () => {

            unsubscribeDraft();

            unsubscribeSettings();

            document.body.style.background = "";

            document.documentElement.style.background = "";

        };

    }, []);

    if (!draftState || !settings) {

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

            {/* ===========================
                Header
            =========================== */}

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

            {/* ===========================
                Draft Boards
            =========================== */}

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

            {/* ===========================
                Draft Flow
            =========================== */}

            <DraftFlow

                draft={draft}

                team1Name={team1Name}

                team2Name={team2Name}

            />

        </div>

    );

}