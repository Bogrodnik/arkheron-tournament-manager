/*
=========================================
Imports
=========================================
*/

import { generateDraftOrder } from "../utils/draftGenerator";
import { useState, useMemo, useEffect } from "react";

import DraftBoard from "../components/draft/DraftBoard";
import DraftFlow from "../components/draft/DraftFlow";
import DraftTimer from "../components/draft/DraftTimer";
import EternalCard from "../components/draft/EternalCard";

import { getActionText } from "../draftLogic";

import { eternals } from "../data/eternals";
import { crowns } from "../data/crowns";
import { amulets } from "../data/amulets";
import { weapons } from "../data/weapons";
import { utilityItems } from "../data/utilityItems";

import "../styles/Draft.css";

export default function Draft() {
/*
=========================================
Draft Component
=========================================
*/

/*
=========================================
Draft State
=========================================
*/

const [draftPool, setDraftPool] =
  useState("eternals");

const [search, setSearch] =
  useState("");

const [draft, setDraft] =
  useState([]);

const [step, setStep] =
  useState(0);
/*
=========================================
Tournament Settings
=========================================
*/

const tournamentSettings =
  JSON.parse(
    localStorage.getItem(
      "tournamentSettings"
    )
  ) || {};

const {
  seriesLength = 5,
  firstTeam = 1,
  swapSides = true,
  draftVariant = "snake",
  picksPerTeam = 3,
  bansPerTeam = 1,
  timerLength = 30,
  enabledPools = {
    eternals: true,
    crowns: true,
    amulets: true,
    weapons: true,
    utility: true
  },
  customDraftOrder = [],
} = tournamentSettings;

const draftOrder =
  draftVariant === "custom"
    ? customDraftOrder
    : generateDraftOrder(
        draftVariant,
        picksPerTeam,
        bansPerTeam,
        firstTeam
      );
/*
=========================================
Timer State
=========================================
*/

const defaultTimer = timerLength;

const [time, setTime] =
  useState(defaultTimer);

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
Logo State
=========================================
*/

const [team1Logo, setTeam1Logo] =
  useState(null);

const [team2Logo, setTeam2Logo] =
  useState(null);

/*
=========================================
Logo Controls
=========================================
*/

function handleLogoUpload(
  event,
  team
) {
  const file =
    event.target.files[0];

  if (!file) {
    return;
  }

  const reader =
    new FileReader();

  reader.onload = (
    e
  ) => {

    if (
      team === 1
    ) {
      setTeam1Logo(
        e.target.result
      );
    } else {
      setTeam2Logo(
        e.target.result
      );
    }

  };

  reader.readAsDataURL(
    file
  );
}
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

const [matchHistory,
  setMatchHistory] =
  useState([]);

/*
=========================================
Save State
=========================================
*/


const [saveStatus,
  setSaveStatus] =
  useState("Not Saved");

const [lastSaved,
  setLastSaved] =
  useState(null);

/*
=========================================
Data Pools
=========================================
*/

const pools = {
  eternals: enabledPools.eternals ? eternals : [],
  crowns: enabledPools.crowns ? crowns : [],
  amulets: enabledPools.amulets ? amulets : [],
  weapons: enabledPools.weapons ? weapons : [],
  utility: enabledPools.utility ? utilityItems : [],
};

const poolNames = {
  eternals: "Eternals",
  crowns: "Crowns",
  amulets: "Amulets",
  weapons: "Weapons",
  utility: "Consumables & Anchors",
};
const allItems = [
  ...pools.eternals,
  ...pools.crowns,
  ...pools.amulets,
  ...pools.weapons,
  ...pools.utility,
];

/*
=========================================
Search Results
=========================================
*/

const availableItems =
  search.trim() === ""
    ? (pools[draftPool] || [])
    : allItems.filter(
        (item) => {

      const query =
        search.toLowerCase();

      return (
        item.name
          ?.toLowerCase()
          .includes(query)

        ||

        item.ability
          ?.toLowerCase()
          .includes(query)

        ||

        item.description
          ?.toLowerCase()
          .includes(query)

        ||

        item.setBonus
          ?.toLowerCase()
          .includes(query)
      );
    });

/*
=========================================
Current Draft Action
=========================================
*/

const currentAction =
  draftOrder[
    step
  ] || null;

/*
=========================================
Timer Effect
=========================================
*/

useEffect(() => {

  if (!running) return;

  const timer =
    setInterval(() => {

    setTime((prev) => {

      if (prev <= 1) {

        setRunning(false);

        if (
          step <
          draftOrder.length - 1
        ) {
          setStep(
            (s) => s + 1
          );
        }

        return defaultTimer;
      }

      return prev - 1;
    });

  }, 1000);

  return () =>
    clearInterval(timer);

}, [
  running,
  step,
  draftOrder,
  defaultTimer,
]);

/*
=========================================
Load Save Effect
=========================================
*/

useEffect(() => {

  const saved =
    localStorage.getItem(
      "arkheronDraftState"
    );

  if (!saved) {
    return;
  }

  const data =
    JSON.parse(saved);

  setDraft(
    data.draft || []
  );

  setStep(
    data.step || 0
  );

  setDraftPool(
    data.draftPool ||
    "eternals"
  );

  setSearch(
    data.search || ""
  );

  setScore(
    data.score || {
      team1: 0,
      team2: 0,
    }
  );

  setGame(
    data.game || 1
  );

  setTeam1Name(
    data.team1Name ||
    "TEAM ALPHA"
  );

  setTeam2Name(
    data.team2Name ||
    "TEAM BETA"
  );

  setMatchHistory(
    data.matchHistory ||
    []
  );

setTime(
  data.time ??
  defaultTimer
);

setRunning(
  data.running ??
  false
);

  setLastSaved(
    data.lastSaved || null
  );


}, []);



/*
=========================================
END PART 1
=========================================
*/
/*
=========================================
Draft Controls
=========================================
*/

function choose(item) {

  if (!currentAction) {
    return;
  }

  setDraft((prev) => [
    ...prev,
    {
      team:
        currentAction.team,

      type:
        currentAction.type,

      item,
    },
  ]);

  setTime(defaultTimer);

  if (
    step <
    draftOrder.length - 1
  ) {

    setStep(
      (s) => s + 1
    );

  } else {

    setRunning(false);

  }
}

function undoDraft() {

  if (
    draft.length === 0
  ) {
    return;
  }

  const updatedDraft =
    [...draft];

  updatedDraft.pop();

  setDraft(
    updatedDraft
  );

  setStep(
    (prev) =>
      Math.max(
        prev - 1,
        0
      )
  );

  setTime(defaultTimer);

  setRunning(false);
}

function resetDraft() {

  setDraft([]);

  setStep(0);

  setTime(defaultTimer);

  setRunning(false);
}

/*
=========================================
Series Controls
=========================================
*/

function winGame(team) {

  setMatchHistory(
    (prev) => [
      ...prev,
      team,
    ]
  );

  if (
    team === "team1"
  ) {

    setScore(
      (prev) => ({
        ...prev,
        team1:
          prev.team1 + 1,
      })
    );

  } else {

    setScore(
      (prev) => ({
        ...prev,
        team2:
          prev.team2 + 1,
      })
    );

  }

  setGame(
    (prev) =>
      prev + 1
  );
}

function undoSeries() {

  if (
    matchHistory.length === 0
  ) {
    return;
  }

  const lastWinner =
    matchHistory[
      matchHistory.length - 1
    ];

  if (
    lastWinner === "team1"
  ) {

    setScore(
      (prev) => ({
        ...prev,
        team1:
          Math.max(
            prev.team1 - 1,
            0
          ),
      })
    );

  } else {

    setScore(
      (prev) => ({
        ...prev,
        team2:
          Math.max(
            prev.team2 - 1,
            0
          ),
      })
    );

  }

  setMatchHistory(
    (prev) =>
      prev.slice(
        0,
        -1
      )
  );

  setGame(
    (prev) =>
      Math.max(
        prev - 1,
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

/*
=========================================
Save Draft State
=========================================
*/

function saveDraftState() {
  try {
    const timestamp =
      new Date()
        .toLocaleTimeString();

  const saveData = {
  draft,
  step,
  draftPool,
  search,
  score,
  game,
  team1Name,
  team2Name,
  team1Logo,
  team2Logo,
  matchHistory,
  time,
  running,
  lastSaved: timestamp,
};

    localStorage.setItem(
      "arkheronDraftState",
      JSON.stringify(
        saveData
      )
    );

    setLastSaved(
      timestamp
    );

    setSaveStatus(
      "Saved"
    );

    console.log(
      "Saved successfully",
      saveData
    );

  } catch (error) {

    console.error(
      "Save failed:",
      error
    );

  }
}

/*
=========================================
Load Draft State
=========================================
*/

function loadDraftState() {
  const saved =
    localStorage.getItem(
      "arkheronDraftState"
    );

  if (!saved) {
    alert(
      "No saved draft found."
    );
    return;
  }

  try {
    const data =
      JSON.parse(saved);

    setDraft(
      data.draft || []
    );

    setStep(
      data.step || 0
    );

    setDraftPool(
      data.draftPool ||
      "eternals"
    );

    setSearch(
      data.search || ""
    );

    setScore(
      data.score || {
        team1: 0,
        team2: 0,
      }
    );

    setGame(
      data.game || 1
    );

    setTeam1Name(
      data.team1Name ||
      "TEAM ALPHA"
    );

    setTeam2Name(
      data.team2Name ||
      "TEAM BETA"
    );

    setTeam1Logo(
      data.team1Logo ||
      null
    );

    setTeam2Logo(
      data.team2Logo ||
      null
    );

    setMatchHistory(
  data.matchHistory ||
  []
);

setTime(
  data.time ??
  defaultTimer
);

setRunning(
  data.running ??
  false
);

setLastSaved(
  data.lastSaved ||
  null
);

    setSaveStatus(
      "Loaded"
    );

    console.log(
      "Draft loaded successfully.",
      data
    );
  } catch (error) {
    console.error(
      "Failed to load save:",
      error
    );

    alert(
      "Save file is corrupted."
    );
  }
}

function clearSavedData() {

  localStorage.removeItem(
    "arkheronDraftState"
  );

  setSaveStatus(
    "Cleared"
  );

  setLastSaved(
    null
  );
}

/*
=========================================
Helper Functions
=========================================
*/

function toggleTimer() {

  setRunning(
    (prev) =>
      !prev
  );
}

function resetTimer() {

  setTime(defaultTimer);

  setRunning(false);
}

function getSaveText() {

  if (
    saveStatus ===
    "Cleared"
  ) {
    return "No Save";
  }

  if (
    lastSaved
  ) {
    return `Saved ${lastSaved}`;
  }

  return "Not Saved";
}

/*
=========================================
END PART 2
=========================================
*/
/*
=========================================
Render
=========================================
*/

return (

  <div className="draft-container">

    {/* =====================================
        Series Header
    ===================================== */}

    <div className="series">

    <div className="series-title-block">

        <h1 className="series-tournament-name">
            {tournamentSettings.tournamentName ||
                "Arkheron Tournament"}
        </h1>

        {tournamentSettings.organizer && (
            <div className="series-organizer">
                {tournamentSettings.organizer}
            </div>
        )}

        <div className="series-title">
            Best of {seriesLength}
        </div>

    </div>

    <div className="series-main-row">

<div className="series-side left">

    <button
        className="team1-win-button"
        onClick={() => winGame("team1")}
    >
        {team1Name} Wins
    </button>

    <span className="series-team-name">
        {team1Name}
    </span>

    {team1Logo && (
        <img
            src={team1Logo}
            className="series-logo"
            alt={team1Name}
        />
    )}

</div>

        <div className="series-middle">

           <div className="series-score">
    <span>{score.team1}</span>
    <span className="series-dash">-</span>
    <span>{score.team2}</span>
</div>

            <div className="series-game">
                Game {game}
            </div>

        </div>
<div className="series-side right">

    {team2Logo && (
        <img
            src={team2Logo}
            className="series-logo"
            alt={team2Name}
        />
    )}

    <span className="series-team-name">
        {team2Name}
    </span>

    <button
        className="team2-win-button"
        onClick={() => winGame("team2")}
    >
        {team2Name} Wins
    </button>

</div>

    </div>

    <div className="series-footer-buttons">

        <button
            className="series-control-button"
            onClick={undoSeries}
        >
            Undo
        </button>

        <button
            className="series-control-button danger"
            onClick={resetSeries}
        >
            Reset
        </button>

    </div>

</div>

    {/* =====================================
        Main Layout
    ===================================== */}

    <div className="draft-layout">

      {/* =====================================
          Top Layout
      ===================================== */}

      <div className="draft-top">

        {/* =====================================
            Left Team
        ===================================== */}

        <aside className="left-panel">
          <div className="team-header-card blue">

            <label className="team-logo-upload">

              {team1Logo ? (
                <img
                  src={team1Logo}
                  className="team-logo"
                  alt="Team 1 Logo"
                />
              ) : (
                <div className="logo-placeholder">
                  ⬆
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  handleLogoUpload(
                    e,
                    1
                  )
                }
              />

            </label>

            <input
              className="team-name-input blue"
              value={team1Name}
              onChange={(e) =>
                setTeam1Name(
                  e.target.value
                )
              }
            />

          </div>
         <DraftBoard
    title="Picks & Bans"
    side="left"
    draft={
        draft.filter(
            (entry) =>
                entry.team === 1
        )
    }
/>

        </aside>

        {/* =====================================
            Center Panel
        ===================================== */}

        <main className="center-panel">

          {/* Draft Controls */}

          <div className="draft-phase">

           <div className="draft-controls-row">

    <div className="draft-pool-group">

        <label className="draft-pool-label">
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
            {Object.entries(poolNames)
                .filter(([key]) => enabledPools[key])
                .map(([key, label]) => (
                    <option
                        key={key}
                        value={key}
                    >
                        {label}
                    </option>
                ))}
        </select>

    </div>

    <div className="draft-buttons-group">

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

            {/* Search */}

            <div className="draft-search">

              <input
                type="text"
                placeholder="Search all items..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

          {/* Timer */}

          <DraftTimer
    currentAction={
        getActionText(
            draftOrder[step]
        )
            .replace(
                "Team 1",
                team1Name
            )
            .replace(
                "Team 2",
                team2Name
            )
    }
    time={time}
    running={running}
    onStartPause={toggleTimer}
    onReset={resetTimer}
/>

          {/* Draft Flow */}

          <DraftFlow
    draftOrder={draftOrder}
    draft={draft}
    currentStep={step}
    team1Name={team1Name}
    team2Name={team2Name}
/>

        </main>

        {/* =====================================
            Right Team
        ===================================== */}

        <aside className="right-panel">
            <div className="team-header-card red">

              <input
                className="team-name-input red"
                value={team2Name}
                onChange={(e) =>
                  setTeam2Name(
                    e.target.value
                  )
                }
              />

              <label className="team-logo-upload">

                {team2Logo ? (
                  <img
                    src={team2Logo}
                    className="team-logo"
                    alt="Team 2 Logo"
                  />
                ) : (
                  <div className="logo-placeholder">
                    ⬆
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleLogoUpload(
                      e,
                      2
                    )
                  }
                />

              </label>

            </div>
          <DraftBoard
    title="Picks & Bans"
    side="right"
    draft={
        draft.filter(
            (entry) =>
                entry.team === 2
        )
    }
/>

        </aside>

      </div>

      {/* =====================================
          Available Items
      ===================================== */}

      <div className="draft-bottom">

        <h2>

          {search
            ? `Search Results (${availableItems.length})`
            : `Available ${poolNames[draftPool]}`}

        </h2>

        <div
    className="cards"
    onWheel={(e) => {
        e.currentTarget.scrollLeft += e.deltaY;
    }}
>

          {availableItems.map(
            (item) => (

              <EternalCard
                key={item.id}
                eternal={item}
                disabled={
                  draft.some(
                    (entry) =>
                      entry.item.id ===
                      item.id
                  )
                }
                onClick={() =>
                  choose(
                    item
                  )
                }
              />

            )
          )}

        </div>

      </div>

    </div>

    {/* =====================================
        Save Overlay
    ===================================== */}

    <div className="save-overlay">

      <div className="save-status">

        💾 {getSaveText()}

      </div>

      <button
        className="save-button"
        onClick={
          saveDraftState
        }
      >
        Save
      </button>

      <button
        className="load-button"
        onClick={
          loadDraftState
        }
      >
        Load
      </button>

      <button
        className="clear-button"
        onClick={
          clearSavedData
        }
      >
        Clear
      </button>

    </div>

  </div>

);

/*
=========================================
End Component
=========================================
*/

}
