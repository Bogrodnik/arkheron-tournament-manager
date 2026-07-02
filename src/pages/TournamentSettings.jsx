/*
=========================================
Imports
=========================================
*/
import "../styles/tournamentSettings.css";
import { useState } from "react";
import { generateDraftOrder } from "../utils/draftGenerator";

/*
=========================================
Default Settings
=========================================
*/

const defaultSettings = {
  tournamentName: "Dahla Cup",

  organizer: "",

  seriesLength: 5,

  firstTeam: 1,

  swapSides: true,

  draftVariant: "snake",

  picksPerTeam: 3,

  bansPerTeam: 1,

  timerLength: 30,

  customDraftOrder: [],

  enabledPools: {
    eternals: true,
    crowns: true,
    amulets: true,
    weapons: true,
    utility: true,
  },
};

/*
=========================================
Tournament Settings Page
=========================================
*/

export default function TournamentSettings() {

/*
=========================================
State
=========================================
*/

const [settings, setSettings] =
  useState(() => {

    const saved =
      localStorage.getItem(
        "tournamentSettings"
      );

    return saved
      ? JSON.parse(saved)
      : defaultSettings;

  });

/*
=========================================
Generated Draft Orders
=========================================
*/

const generatedDraftOrder =
  generateDraftOrder(
    settings.draftVariant,
    settings.picksPerTeam,
    settings.bansPerTeam,
    settings.firstTeam,
    settings.customDraftOrder
  );

const previewOrder =
  settings.draftVariant ===
    "custom"
      ? settings.customDraftOrder
      : generatedDraftOrder;

/*
=========================================
Update Setting
=========================================
*/

function updateSetting(
  key,
  value
) {

  setSettings(
    (prev) => ({
      ...prev,
      [key]: value,
    })
  );

}

/*
=========================================
Update Pool
=========================================
*/

function updatePool(
  pool
) {

  setSettings(
    (prev) => ({

      ...prev,

      enabledPools: {

        ...prev.enabledPools,

        [pool]:
          !prev.enabledPools[
            pool
          ],

      },

    })
  );

}

/*
=========================================
Custom Draft Controls
=========================================
*/

function addDraftStep(
  type
) {

  setSettings(
    (prev) => ({

      ...prev,

      customDraftOrder: [

        ...prev.customDraftOrder,

        {
          team: 1,
          type,
        },

      ],

    })
  );

}

function removeDraftStep(
  index
) {

  setSettings(
    (prev) => ({

      ...prev,

      customDraftOrder:
        prev.customDraftOrder.filter(
          (
            _,
            i
          ) =>
            i !== index
        ),

    })
  );

}

function updateDraftStep(
  index,
  field,
  value
) {

  setSettings(
    (prev) => ({

      ...prev,

      customDraftOrder:
        prev.customDraftOrder.map(
          (
            step,
            i
          ) => {

            if (
              i !== index
            ) {
              return step;
            }

            return {

              ...step,

              [field]:
                value,

            };

          }
        ),

    })
  );

}

function moveDraftStepUp(
  index
) {

  if (
    index === 0
  ) {
    return;
  }

  const updated = [
    ...settings.customDraftOrder
  ];

  [
    updated[index - 1],
    updated[index]
  ] = [
    updated[index],
    updated[index - 1]
  ];

  updateSetting(
    "customDraftOrder",
    updated
  );

}

function moveDraftStepDown(
  index
) {

  if (
    index ===
    settings.customDraftOrder.length - 1
  ) {
    return;
  }

  const updated = [
    ...settings.customDraftOrder
  ];

  [
    updated[index + 1],
    updated[index]
  ] = [
    updated[index],
    updated[index + 1]
  ];

  updateSetting(
    "customDraftOrder",
    updated
  );

}

/*
=========================================
Save Settings
=========================================
*/

function saveSettings() {

  localStorage.setItem(
    "tournamentSettings",
    JSON.stringify(
      settings
    )
  );

  alert(
    "Tournament settings saved."
  );

}

/*
=========================================
Load Settings
=========================================
*/

function loadSettings() {

  const saved =
    localStorage.getItem(
      "tournamentSettings"
    );

  if (!saved) {

    alert(
      "No saved settings found."
    );

    return;
  }

  setSettings(
    JSON.parse(saved)
  );

}

/*
=========================================
Reset Settings
=========================================
*/

function resetSettings() {

  setSettings(
    defaultSettings
  );

  localStorage.removeItem(
    "tournamentSettings"
  );

}

/*
=========================================
Render
=========================================
*/

return (
    <div className="settings-page">

        <h1>
            Tournament Settings
        </h1>

        {/* LEFT COLUMN */}

        <div className="settings-left">

            {/* Tournament */}

            <div className="settings-card tournament-card">

                <h2>Tournament</h2>

                <label>Tournament Name</label>

                <input
                    value={settings.tournamentName}
                    onChange={(e) =>
                        updateSetting(
                            "tournamentName",
                            e.target.value
                        )
                    }
                />

                <label>Organizer</label>

                <input
                    value={settings.organizer}
                    onChange={(e) =>
                        updateSetting(
                            "organizer",
                            e.target.value
                        )
                    }
                />

            </div>

            {/* Match Rules */}

            <div className="settings-card match-card">

                <h2>Match Rules</h2>

                <label>Series Length</label>

                <select
                    value={settings.seriesLength}
                    onChange={(e) =>
                        updateSetting(
                            "seriesLength",
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={1}>BO1</option>
                    <option value={3}>BO3</option>
                    <option value={5}>BO5</option>
                    <option value={7}>BO7</option>
                    <option value={9}>BO9</option>
                </select>

                <label>Starting Team</label>

                <select
                    value={settings.firstTeam}
                    onChange={(e) =>
                        updateSetting(
                            "firstTeam",
                            Number(e.target.value)
                        )
                    }
                >
                    <option value={1}>Team 1</option>
                    <option value={2}>Team 2</option>
                </select>

                <label className="checkbox">

                    <input
                        type="checkbox"
                        checked={settings.swapSides}
                        onChange={(e) =>
                            updateSetting(
                                "swapSides",
                                e.target.checked
                            )
                        }
                    />

                    Swap Sides Between Games

                </label>

            </div>

            {/* Draft Rules */}

            <div className="settings-card draft-card">

                <h2>Draft Rules</h2>

                <label>Draft Variant</label>

                <select
                    value={settings.draftVariant}
                    onChange={(e) =>
                        updateSetting(
                            "draftVariant",
                            e.target.value
                        )
                    }
                >
                    <option value="snake">Snake Draft</option>
                    <option value="alternating">Alternating Draft</option>
                    <option value="double-ban">Double Ban</option>
                    <option value="custom">Custom Sequence</option>
                </select>

                <label>Picks Per Team</label>

                <input
                    type="number"
                    min={0}
                    max={99}
                    value={settings.picksPerTeam}
                    onChange={(e) =>
                        updateSetting(
                            "picksPerTeam",
                            Number(e.target.value)
                        )
                    }
                />

                <label>Bans Per Team</label>

                <input
                    type="number"
                    min={0}
                    max={99}
                    value={settings.bansPerTeam}
                    onChange={(e) =>
                        updateSetting(
                            "bansPerTeam",
                            Number(e.target.value)
                        )
                    }
                />

                <label>Timer Length</label>

                <input
                    type="number"
                    min={5}
                    max={300}
                    value={settings.timerLength}
                    onChange={(e) =>
                        updateSetting(
                            "timerLength",
                            Number(e.target.value)
                        )
                    }
                />

            </div>

        </div>

        {/* LEFT MIDDLE COLUMN */}

        <div className="settings-left-middle">

            {/* Pools */}

            <div className="settings-card pools-card">

                <h2>Enabled Pools</h2>

                {
                    Object.keys(
                        settings.enabledPools
                    ).map(
                        (pool) => (

                            <label
                                key={pool}
                                className="checkbox"
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        settings.enabledPools[
                                            pool
                                        ]
                                    }
                                    onChange={() =>
                                        updatePool(pool)
                                    }
                                />

                                {pool}

                            </label>

                        )
                    )
                }

            </div>

            {/* Save / Load */}

            <div className="settings-card save-card">

                <h2>Settings</h2>

                <button
                    onClick={saveSettings}
                >
                    Save Settings
                </button>

                <button
                    onClick={loadSettings}
                >
                    Load Settings
                </button>

                <button
                    className="danger"
                    onClick={resetSettings}
                >
                    Reset Settings
                </button>

            </div>

        </div>

        {/* RIGHT MIDDLE COLUMN */}

        <div className="settings-right-middle">

            <div className="settings-card preview-card">

                <h2>
                    Draft Preview
                </h2>

                <div className="draft-preview">

                    {
                        previewOrder.map(
                            (
                                action,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="draft-preview-row"
                                >

                                    <div className="draft-preview-number">
                                        {index + 1}
                                    </div>

                                    <div className="draft-preview-team">
                                        Team {action.team}
                                    </div>

                                    <div
                                        className={`draft-preview-type ${action.type}`}
                                    >
                                        {action.type}
                                    </div>

                                </div>

                            )
                        )
                    }

                </div>

            </div>

        </div>

        {/* RIGHT COLUMN */}

        <div className="settings-right">

            {
                settings.draftVariant ===
                "custom" && (

                    <div className="settings-card custom-sequence-card">

                        <h2>
                            Custom Draft Sequence
                        </h2>

                        <div className="custom-sequence-list">

                            {
                                settings.customDraftOrder.map(
                                    (
                                        step,
                                        index
                                    ) => (

                                        <div
                                            key={index}
                                            className="custom-draft-row"
                                        >

                                            <div className="custom-step-number">
                                                {index + 1}
                                            </div>

                                            <select
                                                value={step.team}
                                                onChange={(e) =>
                                                    updateDraftStep(
                                                        index,
                                                        "team",
                                                        Number(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            >
                                                <option value={1}>
                                                    Team 1
                                                </option>

                                                <option value={2}>
                                                    Team 2
                                                </option>

                                            </select>

                                            <select
                                                value={step.type}
                                                onChange={(e) =>
                                                    updateDraftStep(
                                                        index,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="pick">
                                                    Pick
                                                </option>

                                                <option value="ban">
                                                    Ban
                                                </option>

                                            </select>

                                            <button
                                                onClick={() =>
                                                    moveDraftStepUp(index)
                                                }
                                            >
                                                ↑
                                            </button>

                                            <button
                                                onClick={() =>
                                                    moveDraftStepDown(index)
                                                }
                                            >
                                                ↓
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={() =>
                                                    removeDraftStep(index)
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    )
                                )
                            }

                        </div>

                        <div className="custom-draft-buttons">

                            <button
                                onClick={() =>
                                    addDraftStep("pick")
                                }
                            >
                                + Add Pick
                            </button>

                            <button
                                onClick={() =>
                                    addDraftStep("ban")
                                }
                            >
                                + Add Ban
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

    </div>
);
/*
=========================================
End Component
=========================================
*/

}