const STORAGE_KEY = "arkheron:tournament-navigation-state";

function readStateMap() {

    try {

        const rawValue = window.localStorage.getItem(STORAGE_KEY);

        if (!rawValue) {

            return {};

        }

        const parsed = JSON.parse(rawValue);

        if (!parsed || typeof parsed !== "object") {

            return {};

        }

        return parsed;

    } catch (error) {

        console.error("Failed to read tournament navigation state:", error);
        return {};

    }

}

function writeStateMap(stateMap) {

    try {

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stateMap)
        );

    } catch (error) {

        console.error("Failed to save tournament navigation state:", error);

    }

}

export function getTournamentNavigationState(tournamentId) {

    if (!tournamentId) {

        return {};

    }

    const stateMap = readStateMap();

    return stateMap[tournamentId] || {};

}

export function saveTournamentNavigationState(
    tournamentId,
    updates
) {

    if (!tournamentId || !updates || typeof updates !== "object") {

        return;

    }

    const stateMap = readStateMap();
    const currentState = stateMap[tournamentId] || {};

    stateMap[tournamentId] = {
        ...currentState,
        ...updates,
        updatedAt: Date.now(),
    };

    writeStateMap(stateMap);

}
