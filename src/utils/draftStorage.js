/*
=========================================
Draft Storage
=========================================
*/

const STORAGE_KEY = "arkheronDraftState";

/*
=========================================
Save
=========================================
*/

export function saveDraftToStorage(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}

/*
=========================================
Load
=========================================
*/

export function loadDraftFromStorage() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

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

export function clearDraftStorage() {

    localStorage.removeItem(
        STORAGE_KEY
    );

}