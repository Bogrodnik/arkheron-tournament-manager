import {
    doc,
    setDoc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

const legacySettingsRef =
    doc(
        db,
        "live",
        "settings"
    );

let legacySaveTimeout = null;
let tournamentSaveTimeout = null;

function getTournamentSettingsRef(tournamentId) {

    return doc(
        db,
        "tournaments",
        tournamentId,
        "settings",
        "config"
    );

}

// Legacy API. Keep this while existing pages use the shared live document.
export function saveSettings(settings) {

    if (legacySaveTimeout) {

        clearTimeout(legacySaveTimeout);

    }

    legacySaveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                legacySettingsRef,
                settings
            );

        } catch (error) {

            console.error(
                "Failed to save settings:",
                error
            );

        }

    }, 250);

}

// Legacy API. Keep this while existing pages use the shared live document.
export function listenToSettings(callback) {

    return onSnapshot(
        legacySettingsRef,
        snapshot => {

            if (snapshot.exists()) {

                callback(snapshot.data());

            }

        },
        error => {

            console.error(
                "Firestore listener error:",
                error
            );

        }
    );

}

export function saveTournamentSettings(
    tournamentId,
    settings
) {

    if (tournamentSaveTimeout) {

        clearTimeout(tournamentSaveTimeout);

    }

    tournamentSaveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                getTournamentSettingsRef(tournamentId),
                settings
            );

        } catch (error) {

            console.error(
                "Failed to save tournament settings:",
                error
            );

        }

    }, 250);

}

export function listenToTournamentSettings(
    tournamentId,
    callback
) {

    return onSnapshot(
        getTournamentSettingsRef(tournamentId),
        snapshot => {

            if (snapshot.exists()) {

                callback(snapshot.data());

            }

        },
        error => {

            console.error(
                "Tournament settings listener error:",
                error
            );

        }
    );

}
