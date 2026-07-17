/*
=========================================
Imports
=========================================
*/

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/tournamentSettings.css";

import { generateDraftOrder } from "../utils/draftGenerator";
import {
    DEFAULT_TOURNAMENT_SETTINGS,
} from "../defaults/tournamentDefaults";

import {
    saveSettings as saveSettingsToFirebase,
    listenToTournamentSettings,
    saveTournamentSettings,
} from "../firebase/settingsService";

/*
=========================================
Default Settings
=========================================
*/

/*
=========================================
Tournament Settings Page
=========================================
*/

export default function TournamentSettings() {

const { tournamentId } = useParams();

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

        if (!saved) {

            return DEFAULT_TOURNAMENT_SETTINGS;

        }

        try {

            return JSON.parse(saved);

        } catch {

            return DEFAULT_TOURNAMENT_SETTINGS;

        }

});

/*
=========================================
Tournament Settings Load
=========================================
*/

useEffect(() => {

    if (!tournamentId) {

        return undefined;

    }

    return listenToTournamentSettings(
        tournamentId,
        setSettings
    );

}, [tournamentId]);

/*
=========================================
Auto Save
=========================================
*/

useEffect(() => {

    localStorage.setItem(

        "tournamentSettings",

        JSON.stringify(settings)

    );

    if (tournamentId) {

        saveTournamentSettings(
            tournamentId,
            settings
        );

    } else {

        saveSettingsToFirebase(settings);

    }

}, [settings, tournamentId]);

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
    settings.draftVariant === "custom"
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

        prev => ({

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

function updatePool(pool) {

    setSettings(

        prev => ({

            ...prev,

            enabledPools: {

                ...prev.enabledPools,

                [pool]:
                    !prev.enabledPools[pool],

            },

        })

    );

}

/*
=========================================
Custom Draft Controls
=========================================
*/

function addDraftStep(type) {

    setSettings(

        prev => ({

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

function removeDraftStep(index) {

    setSettings(

        prev => ({

            ...prev,

            customDraftOrder:

                prev.customDraftOrder.filter(

                    (_, i) =>

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

        prev => ({

            ...prev,

            customDraftOrder:

                prev.customDraftOrder.map(

                    (step, i) => {

                        if (i !== index) {

                            return step;

                        }

                        return {

                            ...step,

                            [field]: value,

                        };

                    }

                ),

        })

    );

}

function moveDraftStepUp(index) {

    if (index === 0) {

        return;

    }

    const updated = [

        ...settings.customDraftOrder,

    ];

    [

        updated[index - 1],

        updated[index],

    ] = [

        updated[index],

        updated[index - 1],

    ];

    updateSetting(

        "customDraftOrder",

        updated

    );

}

function moveDraftStepDown(index) {

    if (

        index ===

        settings.customDraftOrder.length - 1

    ) {

        return;

    }

    const updated = [

        ...settings.customDraftOrder,

    ];

    [

        updated[index + 1],

        updated[index],

    ] = [

        updated[index],

        updated[index + 1],

    ];

    updateSetting(

        "customDraftOrder",

        updated

    );

}

function resetCustomDraftOrder() {

    updateSetting(
        "customDraftOrder",
        DEFAULT_TOURNAMENT_SETTINGS.customDraftOrder
    );

}

/*
=========================================
Reset Settings
=========================================
*/

function resetSettings() {

    localStorage.removeItem(
        "tournamentSettings"
    );

    setSettings(
        DEFAULT_TOURNAMENT_SETTINGS
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

        <div className="settings-card settings-overview-card">

            <div className="settings-overview-layout">

                <div className="settings-section settings-section-tournament">

                    <h2>Tournament</h2>

                    <div className="settings-section-grid settings-section-grid-1up">

                        <label>
                            Tournament Name

                            <input
                                value={settings.tournamentName}
                                onChange={(e) =>
                                    updateSetting(
                                        "tournamentName",
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Organizer

                            <input
                                value={settings.organizer}
                                onChange={(e) =>
                                    updateSetting(
                                        "organizer",
                                        e.target.value
                                    )
                                }
                            />
                        </label>

                    </div>

                </div>

                <div className="settings-overview-rules">

                    <div className="settings-section settings-section-rules">

                        <h2>Match Rules</h2>

                        <div className="settings-section-grid settings-section-grid-2up">

                            <label>
                                Series Length

                                <span className="settings-select-wrap">
                                    <select
                                        className="settings-select"
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
                                </span>
                            </label>

                            <label>
                                Starting Team

                                <span className="settings-select-wrap">
                                    <select
                                        className="settings-select"
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
                                </span>
                            </label>

                        </div>

                        <label className="checkbox settings-inline-checkbox">

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

                    <div className="settings-section settings-section-rules">

                        <h2>Draft Rules</h2>

                        <div className="settings-section-grid settings-section-grid-4up">

                            <label>
                                Draft Variant

                                <span className="settings-select-wrap">
                                    <select
                                        className="settings-select"
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
                                </span>
                            </label>

                            <label>
                                Picks Per Team

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
                            </label>

                            <label>
                                Bans Per Team

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
                            </label>

                            <label>
                                Timer Length

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
                            </label>

                        </div>

                    </div>

                </div>

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

                                            <span className="settings-select-wrap">
                                                <select
                                                    className="settings-select"
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
                                            </span>

                                            <span className="settings-select-wrap settings-select-wrap-flex">
                                                <select
                                                    className="settings-select"
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
                                            </span>

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

                            <button
                                className="danger"
                                onClick={resetCustomDraftOrder}
                            >
                                Reset Custom Draft
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

        <div className="settings-page-actions">

            <button
                className="danger settings-reset-button"
                onClick={resetSettings}
            >
                Reset Settings
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
