import { useState, useEffect } from "react";

import { eternals } from "../data/eternals";
import { crowns } from "../data/crowns";
import { amulets } from "../data/amulets";
import { weapons } from "../data/weapons";
import { utilityItems } from "../data/utilityItems";

import {
  draftOrder,
  getCurrentAction,
  getActionText,
} from "../draftLogic";

import EternalCard from "../components/EternalCard";

import DraftBoard from "../components/draft/DraftBoard";
import DraftTimer from "../components/draft/DraftTimer";
import DraftFlow from "../components/draft/DraftFlow";

export default function Draft() {

  /*
  =========================================
  Draft State
  =========================================
  */

  const [draftPool, setDraftPool] =
    useState("eternals");

  const [draft, setDraft] =
    useState([]);

  const [step, setStep] =
    useState(0);

  /*
  =========================================
  Timer State
  =========================================
  */

  const [time, setTime] =
    useState(30);

  const [running, setRunning] =
    useState(false);

  /*
  =========================================
  Team State
  =========================================
  */

  const [team1Name, setTeam1Name] =
    useState("TEAM ALPHA");

  const [team2Name, setTeam2Name] =
    useState("TEAM BETA");

  /*
  =========================================
  Series State
  =========================================
  */

  const [score, setScore] =
    useState({
      team1: 0,
      team2: 0,
    });

  const [game, setGame] =
    useState(1);

  const [matchHistory, setMatchHistory] =
    useState([]);

  /*
  =========================================
  Draft Pool Data
  =========================================
  */

  const pools = {
    eternals,
    crowns,
    amulets,
    weapons,
    utility: utilityItems,
  };

  const poolNames = {
    eternals: "Eternals",
    crowns: "Crowns",
    amulets: "Amulets",
    weapons: "Weapons",
    utility: "Consumables & Anchors",
  };

  const availableItems =
    pools[draftPool] || [];

  /*
  =========================================
  Current Draft Action
  =========================================
  */

  const currentAction =
    getCurrentAction(step);

  /*
  =========================================
  Timer Logic
  =========================================
  */

  useEffect(() => {

    if (!running) return;

    const timer = setInterval(() => {

      setTime(prev => {

        if (prev <= 1) {

          setRunning(false);

          if (
            step <
            draftOrder.length - 1
          ) {
            setStep(
              s => s + 1
            );
          }

          return 30;
        }

        return prev - 1;

      });

    }, 1000);

    return () =>
      clearInterval(timer);

  }, [running, step]);

  /*
  =========================================
  Draft Actions
  =========================================
  */

  function choose(item) {

    if (!currentAction) return;

    setDraft(prev => [
      ...prev,
      {
        team:
          currentAction.team,
        type:
          currentAction.type,
        item,
      },
    ]);

    setTime(30);

    if (
      step <
      draftOrder.length - 1
    ) {
      setStep(
        s => s + 1
      );
    }
    else {
      setRunning(false);
    }
  }

  function undoDraft() {

    if (
      draft.length === 0
    ) return;

    const copy = [...draft];

    copy.pop();

    setDraft(copy);

    setStep(
      s => Math.max(
        s - 1,
        0
      )
    );

    setTime(30);
  }

  function resetDraft() {

    setDraft([]);

    setStep(0);

    setTime(30);

    setRunning(false);
  }

  /*
  =========================================
  Series Controls
  =========================================
  */

  function winGame(team) {

    setMatchHistory(prev => [
      ...prev,
      team,
    ]);

    if (team === "team1") {

      setScore(prev => ({
        ...prev,
        team1:
          prev.team1 + 1,
      }));

    }
    else {

      setScore(prev => ({
        ...prev,
        team2:
          prev.team2 + 1,
      }));

    }

    setGame(
      g => g + 1
    );
  }

  function undoSeries() {

    if (
      matchHistory.length === 0
    ) return;

    const lastWinner =
      matchHistory[
        matchHistory.length - 1
      ];

    if (
      lastWinner === "team1"
    ) {

      setScore(prev => ({
        ...prev,
        team1:
          Math.max(
            prev.team1 - 1,
            0
          ),
      }));

    }
    else {

      setScore(prev => ({
        ...prev,
        team2:
          Math.max(
            prev.team2 - 1,
            0
          ),
      }));

    }

    setMatchHistory(prev =>
      prev.slice(0, -1)
    );

    setGame(g =>
      Math.max(
        g - 1,
        1
      )
    );
  }

  function resetSeries() {

    setScore({
      team1: 0,
      team2: 0,
    });

    setMatchHistory([]);

    setGame(1);
  }

  return (
    <div className="draft-container">

      <div className="series">

        <h2>Best of 5</h2>

        <h3>
          {team1Name}
          {" "}
          {score.team1}
          {" - "}
          {score.team2}
          {" "}
          {team2Name}
        </h3>

        <p>
          Game {game}
        </p>

        <div className="series-buttons">

          <button
            className="team1-win-button"
            onClick={() =>
              winGame("team1")
            }
          >
            {team1Name} Wins
          </button>

          <button
            className="team2-win-button"
            onClick={() =>
              winGame("team2")
            }
          >
            {team2Name} Wins
          </button>

          <button
            className="series-small-button"
            onClick={undoSeries}
          >
            Undo
          </button>

          <button
            className="series-small-button danger"
            onClick={resetSeries}
          >
            Reset
          </button>

        </div>

      </div>

      <div className="draft-layout">

        <div className="draft-top">

          <aside className="left-panel">

            <input
              className="team-name-input blue"
              value={team1Name}
              onChange={(e) =>
                setTeam1Name(
                  e.target.value
                )
              }
            />

            <DraftBoard
              draft={
                draft.filter(
                  x => x.team === 1
                )
              }
            />

          </aside>

          <main className="center-panel">

            <div className="draft-phase">

              <div className="draft-controls-row">

                <label>
                  Draft Pool
                </label>

                <select
                  value={draftPool}
                  onChange={(e) =>
                    setDraftPool(
                      e.target.value
                    )
                  }
                >
                  <option value="eternals">
                    Eternals
                  </option>

                  <option value="crowns">
                    Crowns
                  </option>

                  <option value="amulets">
                    Amulets
                  </option>

                  <option value="weapons">
                    Weapons
                  </option>

                  <option value="utility">
                    Consumables & Anchors
                  </option>

                </select>

                <button
                  className="undo-button"
                  onClick={undoDraft}
                >
                  Undo
                </button>

                <button
                  className="reset-button"
                  onClick={resetDraft}
                >
                  Reset Draft
                </button>

              </div>

            </div>

            <DraftTimer
              currentAction={
                currentAction
                  ? getActionText(
                      currentAction
                    )
                  : "Draft Complete"
              }
              time={time}
              running={running}
              onStartPause={() =>
                setRunning(
                  !running
                )
              }
              onReset={() =>
                setTime(30)
              }
            />

            <DraftFlow
              draftOrder={draftOrder}
              draft={draft}
              currentStep={step}
            />

          </main>

          <aside className="right-panel">

            <input
              className="team-name-input red"
              value={team2Name}
              onChange={(e) =>
                setTeam2Name(
                  e.target.value
                )
              }
            />

            <DraftBoard
              draft={
                draft.filter(
                  x => x.team === 2
                )
              }
            />

          </aside>

        </div>

        <div className="draft-bottom">

          <h2>
            Available {
              poolNames[
                draftPool
              ]
            }
          </h2>

          <div className="cards">

            {availableItems.map(
              item => (
                <EternalCard
                  key={item.id}
                  eternal={item}
                  disabled={
                    draft.some(
                      x =>
                        x.item.id ===
                        item.id
                    )
                  }
                  onClick={() =>
                    choose(item)
                  }
                />
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}