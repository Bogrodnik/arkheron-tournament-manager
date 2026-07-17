/*
=========================================
Draft Storage
=========================================
*/

const STORAGE_KEY = "arkheronDraftState";

function getStorageKey(tournamentId) {

    return tournamentId
        ? `${STORAGE_KEY}:${tournamentId}`
        : STORAGE_KEY;

}

/*
=========================================
Save
=========================================
*/

export function saveDraftToStorage(data, tournamentId) {

    try {

        localStorage.setItem(
            getStorageKey(tournamentId),
            JSON.stringify(data)
        );

    }

    catch (error) {

        console.warn(
            "Failed to save draft state to localStorage:",
            error
        );

    }

}

/*
=========================================
Load
=========================================
*/

export function loadDraftFromStorage(tournamentId) {

    const storageKey = getStorageKey(tournamentId);
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
        return null;
    }

    try {

        return JSON.parse(saved);

    }

    catch {

        return null;

    }

}

/*
=========================================
Clear
=========================================
*/

export function clearDraftStorage(tournamentId) {

    localStorage.removeItem(
        getStorageKey(tournamentId)
    );

}