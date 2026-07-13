import {
    doc,
    setDoc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

const settingsRef =
    doc(
        db,
        "live",
        "settings"
    );

let saveTimeout = null;

export function saveSettings(settings) {

    if (saveTimeout) {

        clearTimeout(saveTimeout);

    }

    saveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                settingsRef,
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

export function listenToSettings(callback) {

    return onSnapshot(

        settingsRef,

        (snapshot) => {

            if (snapshot.exists()) {

                callback(
                    snapshot.data()
                );

            }

        },

        (error) => {

            console.error(
                "Firestore listener error:",
                error
            );

        }

    );

}