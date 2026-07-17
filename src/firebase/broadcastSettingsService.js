import {
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const legacyBroadcastRef = doc(
    db,
    "broadcastSettings",
    "broadcast"
);

export const DEFAULT_SETTINGS = {

    showLeftTeam: true,
    showRightTeam: true,
    showLogos: true,
    showNames: true,
    showScores: true,
    showSeriesBar: true,
    showPicksBans: true,
    showTimer: true,
    showDraftFlow: true,

};

function getTournamentBroadcastRef(tournamentId) {

    return doc(
        db,
        "tournaments",
        tournamentId,
        "broadcast",
        "config"
    );

}

function listenToBroadcastDocument(reference, callback) {

    return onSnapshot(
        reference,
        async snapshot => {

            if (!snapshot.exists()) {

                await setDoc(
                    reference,
                    DEFAULT_SETTINGS
                );

                callback(DEFAULT_SETTINGS);

                return;

            }

            callback({
                ...DEFAULT_SETTINGS,
                ...snapshot.data(),
            });

        },
        error => {

            console.error(
                "Broadcast settings listener error:",
                error
            );

            callback(DEFAULT_SETTINGS);

        }
    );

}

// Legacy API. Keep this while existing pages use the shared live document.
export function listenToBroadcastSettings(callback) {

    return listenToBroadcastDocument(
        legacyBroadcastRef,
        callback
    );

}

// Legacy API. Keep this while existing pages use the shared live document.
export async function updateBroadcastSettings(updates) {

    await setDoc(
        legacyBroadcastRef,
        updates,
        { merge: true }
    );

}

export function listenToTournamentBroadcastSettings(
    tournamentId,
    callback
) {

    return listenToBroadcastDocument(
        getTournamentBroadcastRef(tournamentId),
        callback
    );

}

export async function updateTournamentBroadcastSettings(
    tournamentId,
    updates
) {

    await setDoc(
        getTournamentBroadcastRef(tournamentId),
        updates,
        { merge: true }
    );

}
