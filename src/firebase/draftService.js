import {
    doc,
    setDoc,
    onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

const draftRef =
    doc(
        db,
        "live",
        "draft"
    );

let saveTimeout = null;

export function saveDraftState(state) {

    if (saveTimeout) {

        clearTimeout(saveTimeout);

    }

    saveTimeout = setTimeout(async () => {

        try {

            await setDoc(
                draftRef,
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

export function listenToDraft(callback) {

    return onSnapshot(

        draftRef,

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