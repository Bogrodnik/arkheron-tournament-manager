import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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

import "../../styles/observer/DraftOverlayV2.css";

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

export default function DraftOverlayV2() {

    const navigate = useNavigate();
    const { tournamentId } = useParams();
    const [searchParams] = useSearchParams();

    useEffect(() => {

        if (tournamentId) {

            return;

        }

        const legacyTournamentId =
            searchParams.get("tournament");

        if (!legacyTournamentId) {

            return;

        }

        navigate(
            `/overlay-v2/${encodeURIComponent(legacyTournamentId)}`,
            { replace: true }
        );

    }, [navigate, searchParams, tournamentId]);

    const hasLegacyTournamentRedirect =
        !tournamentId &&
        Boolean(searchParams.get("tournament"));

    const [draftState, setDraftState] = useState(null);
    const [settings, setSettings] = useState(null);
    const [broadcastSettings, setBroadcastSettings] =
        useState(DEFAULT_SETTINGS);

    useEffect(() => {

        document.body.style.background = "transparent";
        document.documentElement.style.background = "transparent";

        const unsubscribeDraft = subscribeToDraft(
            tournamentId,
            setDraftState
        );

        const unsubscribeSettings = subscribeToSettings(
            tournamentId,
            setSettings
        );

        const unsubscribeBroadcast = subscribeToBroadcastSettings(
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

    if (hasLegacyTournamentRedirect) {

        return null;

    }

    if (!draftState || !settings || !broadcastSettings) {

        return (
            <div className="draft-v2-loading">
                Waiting for Draft...
            </div>
        );

    }

    const {
        draft,
        step,
        game,
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

    const currentAction = draftOrder[step];

    const currentActionText =
        currentAction
            ? getActionText(currentAction)
                  .replace("Team 1", team1Name)
                  .replace("Team 2", team2Name)
            : "Draft Complete";

    return (

        <div className="draft-v2-root">

            <div className="draft-v2-vertical">

                {broadcastSettings.showLeftTeam && (

                    <div className="draft-v2-team-card left">

                        {broadcastSettings.showLogos && team1Logo && (
                            <img
                                src={team1Logo}
                                alt=""
                                className="draft-v2-logo"
                            />
                        )}

                        {broadcastSettings.showNames && (
                            <h2>{team1Name}</h2>
                        )}

                    </div>

                )}

                <div className="draft-v2-board left">
                    <DraftBoard
                        side="left"
                        title="Team 1 Picks & Bans"
                        draft={draft.filter(entry => entry.team === 1)}
                    />
                </div>

                <div className="draft-v2-center-card">
                    <div className="draft-v2-title">LIVE DRAFT</div>
                    <div className="draft-v2-game">Game {game ?? 1}</div>

                    {!broadcastSettings.showTimer && (
                        <div className="draft-v2-action-text">
                            {currentActionText}
                        </div>
                    )}
                </div>

                {broadcastSettings.showTimer && (
                    <DraftTimer
                        currentAction={currentActionText}
                        running={running}
                        time={time}
                        showControls={false}
                    />
                )}

                <div className="draft-v2-board right">
                    <DraftBoard
                        side="right"
                        title="Team 2 Picks & Bans"
                        draft={draft.filter(entry => entry.team === 2)}
                    />
                </div>

                {broadcastSettings.showRightTeam && (

                    <div className="draft-v2-team-card right">

                        {broadcastSettings.showNames && (
                            <h2>{team2Name}</h2>
                        )}

                        {broadcastSettings.showLogos && team2Logo && (
                            <img
                                src={team2Logo}
                                alt=""
                                className="draft-v2-logo"
                            />
                        )}

                    </div>

                )}

                {broadcastSettings.showDraftFlow && (
                    <div className="draft-v2-flow-wrap">
                        <DraftFlow
                            draft={draft}
                            team1Name={team1Name}
                            team2Name={team2Name}
                        />
                    </div>
                )}

            </div>

        </div>

    );

}
