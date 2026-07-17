import {
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const legacyDraftRef =
    doc(
        db,
        "live",
        "draft"
    );

let legacySaveTimeout = null;
let tournamentSaveTimeout = null;

function getTournamentDraftRef(tournamentId) {

    return doc(
        db,
        "tournaments",
        tournamentId,
        "draft",
        "state"
    );

}

// Legacy API. Keep this while existing pages use the shared live document.
export function saveDraftState(state) {

    if (legacySaveTimeout) {

        clearTimeout(legacySaveTimeout);

    }

    legacySaveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                legacyDraftRef,
                state
            );

        } catch (error) {

            console.error(
                "Failed to save draft:",
                error
            );

        }

    }, 250);

}

// Legacy API. Keep this while existing pages use the shared live document.
export function listenToDraft(callback) {

    return onSnapshot(
        legacyDraftRef,
        snapshot => {

            callback(
                snapshot.exists()
                    ? snapshot.data()
                    : null
            );

        },
        error => {

            console.error(
                "Firestore listener error:",
                error
            );

        }
    );

}

export function saveTournamentDraftState(
    tournamentId,
    state
) {

    if (tournamentSaveTimeout) {

        clearTimeout(tournamentSaveTimeout);

    }

    tournamentSaveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                getTournamentDraftRef(tournamentId),
                state
            );

        } catch (error) {

            console.error(
                "Failed to save tournament draft:",
                error
            );

        }

    }, 250);

}

export function listenToTournamentDraft(
    tournamentId,
    callback
) {

    return onSnapshot(
        getTournamentDraftRef(tournamentId),
        snapshot => {

            callback(
                snapshot.exists()
                    ? snapshot.data()
                    : null
            );

        },
        error => {

            console.error(
                "Tournament draft listener error:",
                error
            );

        }
    );

}
