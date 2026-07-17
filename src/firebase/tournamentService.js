import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    serverTimestamp,
    setDoc,
    updateDoc,
    writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";
import {
    createDefaultDraftState,
    DEFAULT_TOURNAMENT_SETTINGS,
} from "../defaults/tournamentDefaults";
import {
    DEFAULT_SETTINGS as DEFAULT_BROADCAST_SETTINGS,
} from "./broadcastSettingsService";

const tournamentsRef = collection(
    db,
    "tournaments"
);

function tournamentRef(tournamentId) {

    return doc(
        db,
        "tournaments",
        tournamentId
    );

}

function generateId(length = 6) {

    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "";

    for (let index = 0; index < length; index++) {

        id += chars[
            Math.floor(
                Math.random() * chars.length
            )
        ];

    }

    return id;

}

async function deleteTournamentDocument(pathSegments) {

    try {

        await deleteDoc(doc(db, ...pathSegments));

    } catch (error) {

        if (error?.code === "not-found") {

            return;

        }

        throw error;

    }

}

async function deleteTournamentData(tournamentId) {

    const documentPaths = [
        ["tournaments", tournamentId, "draft", "state"],
        ["tournaments", tournamentId, "settings", "config"],
        ["tournaments", tournamentId, "broadcast", "config"],
        ["tournaments", tournamentId],
    ];

    for (const pathSegments of documentPaths) {

        await deleteTournamentDocument(pathSegments);

    }

}

function buildTournamentSettingsSeed(name) {

    return {
        ...DEFAULT_TOURNAMENT_SETTINGS,
        tournamentName: name,
        enabledPools: {
            ...DEFAULT_TOURNAMENT_SETTINGS.enabledPools,
        },
    };

}

export function buildInitialTournamentPayload(
    name = "New Tournament"
) {

    return {
        tournament: {
            name,
            status: "draft",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            version: 1,
        },
        draft: {
            state: createDefaultDraftState(),
        },
        settings: {
            config: buildTournamentSettingsSeed(name),
        },
        broadcast: {
            config: {
                ...DEFAULT_BROADCAST_SETTINGS,
            },
        },
    };

}

export async function createTournament(
    name = "New Tournament"
) {

    let tournamentId = generateId();
    let snapshot = await getDoc(
        tournamentRef(tournamentId)
    );

    while (snapshot.exists()) {

        tournamentId = generateId();
        snapshot = await getDoc(
            tournamentRef(tournamentId)
        );

    }

    const batch = writeBatch(db);
    const payload = buildInitialTournamentPayload(name);

    batch.set(
        tournamentRef(tournamentId),
        payload.tournament
    );

    batch.set(
        doc(
            db,
            "tournaments",
            tournamentId,
            "draft",
            "state"
        ),
        payload.draft.state
    );

    batch.set(
        doc(
            db,
            "tournaments",
            tournamentId,
            "settings",
            "config"
        ),
        payload.settings.config
    );

    batch.set(
        doc(
            db,
            "tournaments",
            tournamentId,
            "broadcast",
            "config"
        ),
        payload.broadcast.config
    );

    await batch.commit();

    return tournamentId;

}

export async function getTournament(tournamentId) {

    const snapshot = await getDoc(
        tournamentRef(tournamentId)
    );

    if (!snapshot.exists()) {

        return null;

    }

    return {
        id: snapshot.id,
        ...snapshot.data(),
    };

}

export async function listTournaments() {

    const snapshot = await getDocs(tournamentsRef);

    return snapshot.docs.map(item => ({
        id: item.id,
        ...item.data(),
    }));

}

export function listenToTournament(
    tournamentId,
    callback
) {

    return onSnapshot(
        tournamentRef(tournamentId),
        snapshot => {

            callback(
                snapshot.exists()
                    ? {
                        id: snapshot.id,
                        ...snapshot.data(),
                    }
                    : null
            );

        }
    );

}

export function listenToTournaments(callback) {

    return onSnapshot(
        tournamentsRef,
        snapshot => {

            callback(
                snapshot.docs.map(item => ({
                    id: item.id,
                    ...item.data(),
                }))
            );

        }
    );

}

export async function updateTournament(
    tournamentId,
    updates
) {

    await updateDoc(
        tournamentRef(tournamentId),
        {
            ...updates,
            updatedAt: serverTimestamp(),
        }
    );

}

export async function renameTournament(
    tournamentId,
    name
) {

    await updateTournament(
        tournamentId,
        { name }
    );

}

export async function deleteTournament(tournamentId) {

    await deleteTournamentData(tournamentId);

}
